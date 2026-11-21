from pathlib import Path
import unittest
from xml.etree import ElementTree as ET

import sys
from pathlib import Path as _Path
sys.path.insert(0, str(_Path(__file__).resolve().parents[4] / "superspec/tools/kowloon-export"))

from wayfinding.drain import drain_station
from wayfinding.source import fit


class WallFootDrain(unittest.TestCase):
    def setUp(self):
        self.scene = ET.parse(
            Path(__file__).resolve().parents[1] / "scene.aml"
        ).getroot()
        self.city = self.scene.find("city")

    def test_level_supported_three_panels_clear_of_weeds_and_jamb(self):
        station = drain_station(self.scene, self.city, [])
        self.assertEqual((station["wall"], station["floor"]), ("brush-78", "brush-0"))
        self.assertEqual(station["count"], 3)
        self.assertAlmostEqual(station["origin"][0], -5.4)
        self.assertAlmostEqual(station["origin"][1], -3.234)
        self.assertAlmostEqual(station["module"] * station["count"], 2.4)
        self.assertEqual(station["origin"][2], 0)
        self.scene.find("box[@id='brush-0']").set("height", "3.90")
        self.assertIsNone(drain_station(self.scene, self.city, []))

    def test_ignores_occupied_eye_level_space(self):
        before = drain_station(self.scene, self.city, [])
        ET.SubElement(self.city, "utility-cabinet", position="-3.25 -3.40 1.5")
        self.assertIsNone(fit(self.scene, [], self.city))
        self.assertEqual(before, drain_station(self.scene, self.city, []))

    def test_rejects_overgrown_or_obstructed_footprint(self):
        obstacle = dict(minX=-6.5, maxX=0, minY=0, maxY=0.18, minZ=2.9, maxZ=3.4)
        self.assertIsNone(drain_station(self.scene, self.city, [obstacle]))
        for i in range(14):
            ET.SubElement(self.city, "weed", position=f"{-6.5 + i * 0.5} -3.24 0")
        self.assertIsNone(drain_station(self.scene, self.city, []))
