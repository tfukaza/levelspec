import { BufferAttribute, BufferGeometry, Vector3 } from "three";

/**
 * Finds convex creases between position-matched triangles. The study uses convex
 * boxes and graded boxes, with at most four neighboring planes per face.
 */
export function withSharpEdges(source: BufferGeometry, minimumAngle: number): BufferGeometry {
  const geometry = source.index ? source.toNonIndexed() : source;
  const positions = geometry.getAttribute("position");
  const faces = [];
  const edges = new Map<string, number[]>();
  for (let i = 0; i < positions.count; i += 3) {
    const points = [0, 1, 2].map(offset => new Vector3().fromBufferAttribute(positions, i + offset));
    const normal = points[1].clone().sub(points[0]).cross(points[2].clone().sub(points[0])).normalize();
    const plane = [...normal.toArray(), -normal.dot(points[0])];
    const face = faces.length;
    faces.push({ points, normal, plane });
    const keys = points.map(point => point.toArray().map(value => Math.round(value * 1e6)).join(","));
    for (let j = 0; j < 3; j++) {
      const key = [keys[j], keys[(j + 1) % 3]].sort().join("/");
      const neighbors = edges.get(key) ?? [];
      neighbors.push(face);
      edges.set(key, neighbors);
    }
  }
  const creasePlanes = faces.map(() => new Set<number>());
  const cosine = Math.cos(minimumAngle * Math.PI / 180);
  for (const neighbors of edges.values()) {
    if (neighbors.length !== 2) continue;
    const [a, b] = neighbors;
    for (const [face, other] of [[a, b], [b, a]]) {
      const current = faces[face], adjacent = faces[other];
      if (current.normal.dot(adjacent.normal) >= cosine) continue;
      if (!current.points.some(point => adjacent.normal.dot(point) + adjacent.plane[3] < -1e-6)) continue;
      creasePlanes[face].add(other);
    }
  }
  const attributes = Array.from({ length: 4 }, () => new Float32Array(positions.count * 4));
  for (const [index, face] of faces.entries()) {
    const planes = new Map<string, number[]>();
    for (const [coplanar, candidate] of faces.entries()) {
      if (candidate.normal.dot(face.normal) < 1 - 1e-6 || Math.abs(candidate.plane[3] - face.plane[3]) > 1e-6) continue;
      for (const neighbor of creasePlanes[coplanar]) {
        const plane = faces[neighbor].plane;
        planes.set(plane.map(value => Math.round(value * 1e6)).join(","), plane);
      }
    }
    for (const [slot, plane] of [...planes.values()].entries()) {
      if (slot >= attributes.length) break;
      for (let vertex = 0; vertex < 3; vertex++) attributes[slot].set(plane, (index * 3 + vertex) * 4);
    }
  }
  for (const [slot, values] of attributes.entries()) {
    geometry.setAttribute(`concreteEdge${slot}`, new BufferAttribute(values, 4));
  }
  if (geometry !== source) source.dispose();
  return geometry;
}
