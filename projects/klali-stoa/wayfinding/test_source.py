import unittest
from pathlib import Path
from xml.etree import ElementTree as ET

import sys
from pathlib import Path as _Path
sys.path.insert(0, str(_Path(__file__).resolve().parents[4] / "superspec/tools/kowloon-export"))

from wayfinding.source import fit, passage_lamp_fits


class PassageTest(unittest.TestCase):
    def setUp(self):
        self.scene = ET.parse(
            Path(__file__).resolve().parents[1] / "scene.aml"
        ).getroot()
        self.city = self.scene.find("city")

    def test_points_left_from_the_visible_face_toward_east_jamb(self):
        station = fit(self.scene, [], self.city)
        self.assertEqual(station["art"], "passage-left.png")
        self.assertEqual(station["right"], [-1, 0, 0])
        self.assertAlmostEqual(station["center"][1], -3.397)
        self.assertEqual(station["height"], 0.5625)

    def test_blind_wall_or_obstructed_doorway(self):
        host = self.scene.find("box[@id='brush-78']")
        host.set("visible", "false")
        self.assertIsNone(fit(self.scene, []))
        host.set("visible", "true")
        block = dict(minX=0.5, maxX=1, minZ=4.4, maxZ=4.5, minY=0, maxY=2)
        self.assertIsNone(fit(self.scene, [block]))
        self.scene.remove(self.scene.find("box[@id='brush-687']"))
        self.assertIsNone(fit(self.scene, []))

    def test_right_arrow_when_an_alternate_west_end_reaches_the_door(self):
        # Leave the east end at x=0, shorten the wall at its west end and
        # close only the original east turn. The back aisle still leads south.
        host = self.scene.find("box[@id='brush-78']")
        host.set("position", "-4 -3.7 0")
        host.set("width", "4")
        closed_turn = dict(minX=0.3, maxX=1.4, minZ=3.45, maxZ=3.65, minY=0, maxY=2)
        station = fit(self.scene, [closed_turn])
        self.assertEqual(station["art"], "passage.png")

    def test_unsupported_route_or_occupied_paint_patch(self):
        ET.SubElement(self.city, "utility-cabinet", position="-3.25 -3.4 1.1")
        self.assertIsNone(fit(self.scene, [], self.city))
        self.scene.remove(self.scene.find("box[@id='brush-0']"))
        self.assertIsNone(fit(self.scene, []))

    def test_lamp_requires_visible_stencil_and_its_authored_clear_seat(self):
        lamp = self.city.find("passage-sign-lamp")
        self.assertTrue(passage_lamp_fits(self.scene, [], self.city, lamp))
        obstacle = dict(minX=-3.4, maxX=-3.1, minY=2.15, maxY=2.25, minZ=3.3, maxZ=3.35)
        self.assertFalse(passage_lamp_fits(self.scene, [obstacle], self.city, lamp))
        lamp.set("heading", "0")
        self.assertFalse(passage_lamp_fits(self.scene, [], self.city, lamp))
        lamp.set("heading", "180")
        self.scene.find("box[@id='brush-78']").set("visible", "false")
        self.assertFalse(passage_lamp_fits(self.scene, [], self.city, lamp))
