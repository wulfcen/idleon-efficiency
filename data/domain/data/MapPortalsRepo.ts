import { MapInfoModel } from '../model/mapInfoModel';

export class MapInfoBase { constructor(public index: number, public data: MapInfoModel) { } }



export const initMapPortalsRepo = () => {
    return [    
        new MapInfoBase(0, <MapInfoModel>{"id": 0, "portalRequirements": [1, 0]}),
        new MapInfoBase(1, <MapInfoModel>{"id": 1, "portalRequirements": [20]}),
        new MapInfoBase(2, <MapInfoModel>{"id": 2, "portalRequirements": [30]}),
        new MapInfoBase(3, <MapInfoModel>{"id": 3, "portalRequirements": [150, 10]}),
        new MapInfoBase(4, <MapInfoModel>{"id": 4, "portalRequirements": [150]}),
        new MapInfoBase(5, <MapInfoModel>{"id": 5, "portalRequirements": [150]}),
        new MapInfoBase(6, <MapInfoModel>{"id": 6, "portalRequirements": [10]}),
        new MapInfoBase(7, <MapInfoModel>{"id": 7, "portalRequirements": [25, 81]}),
        new MapInfoBase(8, <MapInfoModel>{"id": 8, "portalRequirements": [20000]}),
        new MapInfoBase(9, <MapInfoModel>{"id": 9, "portalRequirements": [0]}),
        new MapInfoBase(10, <MapInfoModel>{"id": 10, "portalRequirements": [40]}),
        new MapInfoBase(11, <MapInfoModel>{"id": 11, "portalRequirements": [50, 60]}),
        new MapInfoBase(12, <MapInfoModel>{"id": 12, "portalRequirements": [60]}),
        new MapInfoBase(13, <MapInfoModel>{"id": 13, "portalRequirements": [2500, 50000]}),
        new MapInfoBase(14, <MapInfoModel>{"id": 14, "portalRequirements": [80, 1500]}),
        new MapInfoBase(15, <MapInfoModel>{"id": 15, "portalRequirements": [35000]}),
        new MapInfoBase(16, <MapInfoModel>{"id": 16, "portalRequirements": [200, 3000]}),
        new MapInfoBase(17, <MapInfoModel>{"id": 17, "portalRequirements": [0]}),
        new MapInfoBase(18, <MapInfoModel>{"id": 18, "portalRequirements": [5000]}),
        new MapInfoBase(19, <MapInfoModel>{"id": 19, "portalRequirements": [250]}),
        new MapInfoBase(20, <MapInfoModel>{"id": 20, "portalRequirements": [7]}),
        new MapInfoBase(21, <MapInfoModel>{"id": 21, "portalRequirements": [5]}),
        new MapInfoBase(22, <MapInfoModel>{"id": 22, "portalRequirements": [0]}),
        new MapInfoBase(23, <MapInfoModel>{"id": 23, "portalRequirements": [0]}),
        new MapInfoBase(24, <MapInfoModel>{"id": 24, "portalRequirements": [300, 2000]}),
        new MapInfoBase(25, <MapInfoModel>{"id": 25, "portalRequirements": [0]}),
        new MapInfoBase(26, <MapInfoModel>{"id": 26, "portalRequirements": [350]}),
        new MapInfoBase(27, <MapInfoModel>{"id": 27, "portalRequirements": [30, 4200]}),
        new MapInfoBase(28, <MapInfoModel>{"id": 28, "portalRequirements": [0]}),
        new MapInfoBase(29, <MapInfoModel>{"id": 29, "portalRequirements": [0]}),
        new MapInfoBase(30, <MapInfoModel>{"id": 30, "portalRequirements": [0]}),
        new MapInfoBase(31, <MapInfoModel>{"id": 31, "portalRequirements": [0]}),
        new MapInfoBase(32, <MapInfoModel>{"id": 32, "portalRequirements": [0]}),
        new MapInfoBase(33, <MapInfoModel>{"id": 33, "portalRequirements": [0]}),
        new MapInfoBase(34, <MapInfoModel>{"id": 34, "portalRequirements": [0]}),
        new MapInfoBase(35, <MapInfoModel>{"id": 35, "portalRequirements": [0]}),
        new MapInfoBase(36, <MapInfoModel>{"id": 36, "portalRequirements": [0]}),
        new MapInfoBase(37, <MapInfoModel>{"id": 37, "portalRequirements": [0]}),
        new MapInfoBase(38, <MapInfoModel>{"id": 38, "portalRequirements": [0]}),
        new MapInfoBase(39, <MapInfoModel>{"id": 39, "portalRequirements": [0]}),
        new MapInfoBase(40, <MapInfoModel>{"id": 40, "portalRequirements": [0]}),
        new MapInfoBase(41, <MapInfoModel>{"id": 41, "portalRequirements": [0]}),
        new MapInfoBase(42, <MapInfoModel>{"id": 42, "portalRequirements": [0]}),
        new MapInfoBase(43, <MapInfoModel>{"id": 43, "portalRequirements": [0]}),
        new MapInfoBase(44, <MapInfoModel>{"id": 44, "portalRequirements": [0]}),
        new MapInfoBase(45, <MapInfoModel>{"id": 45, "portalRequirements": [0]}),
        new MapInfoBase(46, <MapInfoModel>{"id": 46, "portalRequirements": [0]}),
        new MapInfoBase(47, <MapInfoModel>{"id": 47, "portalRequirements": [0]}),
        new MapInfoBase(48, <MapInfoModel>{"id": 48, "portalRequirements": [0]}),
        new MapInfoBase(49, <MapInfoModel>{"id": 49, "portalRequirements": [0]}),
        new MapInfoBase(50, <MapInfoModel>{"id": 50, "portalRequirements": [1, 0, 0]}),
        new MapInfoBase(51, <MapInfoModel>{"id": 51, "portalRequirements": [250]}),
        new MapInfoBase(52, <MapInfoModel>{"id": 52, "portalRequirements": [600, 1000]}),
        new MapInfoBase(53, <MapInfoModel>{"id": 53, "portalRequirements": [1000]}),
        new MapInfoBase(54, <MapInfoModel>{"id": 54, "portalRequirements": [15]}),
        new MapInfoBase(55, <MapInfoModel>{"id": 55, "portalRequirements": [30]}),
        new MapInfoBase(56, <MapInfoModel>{"id": 56, "portalRequirements": [30]}),
        new MapInfoBase(57, <MapInfoModel>{"id": 57, "portalRequirements": [1200]}),
        new MapInfoBase(58, <MapInfoModel>{"id": 58, "portalRequirements": [1600]}),
        new MapInfoBase(59, <MapInfoModel>{"id": 59, "portalRequirements": [2000]}),
        new MapInfoBase(60, <MapInfoModel>{"id": 60, "portalRequirements": [2500, 0]}),
        new MapInfoBase(61, <MapInfoModel>{"id": 61, "portalRequirements": [30]}),
        new MapInfoBase(62, <MapInfoModel>{"id": 62, "portalRequirements": [3000]}),
        new MapInfoBase(63, <MapInfoModel>{"id": 63, "portalRequirements": [4000]}),
        new MapInfoBase(64, <MapInfoModel>{"id": 64, "portalRequirements": [5000]}),
        new MapInfoBase(65, <MapInfoModel>{"id": 65, "portalRequirements": [1]}),
        new MapInfoBase(66, <MapInfoModel>{"id": 66, "portalRequirements": [0]}),
        new MapInfoBase(67, <MapInfoModel>{"id": 67, "portalRequirements": [0]}),
        new MapInfoBase(68, <MapInfoModel>{"id": 68, "portalRequirements": [0]}),
        new MapInfoBase(69, <MapInfoModel>{"id": 69, "portalRequirements": [0]}),
        new MapInfoBase(70, <MapInfoModel>{"id": 70, "portalRequirements": [0]}),
        new MapInfoBase(71, <MapInfoModel>{"id": 71, "portalRequirements": [0]}),
        new MapInfoBase(72, <MapInfoModel>{"id": 72, "portalRequirements": [0]}),
        new MapInfoBase(73, <MapInfoModel>{"id": 73, "portalRequirements": [0]}),
        new MapInfoBase(74, <MapInfoModel>{"id": 74, "portalRequirements": [0]}),
        new MapInfoBase(75, <MapInfoModel>{"id": 75, "portalRequirements": [0]}),
        new MapInfoBase(76, <MapInfoModel>{"id": 76, "portalRequirements": [0]}),
        new MapInfoBase(77, <MapInfoModel>{"id": 77, "portalRequirements": [0]}),
        new MapInfoBase(78, <MapInfoModel>{"id": 78, "portalRequirements": [0]}),
        new MapInfoBase(79, <MapInfoModel>{"id": 79, "portalRequirements": [0]}),
        new MapInfoBase(80, <MapInfoModel>{"id": 80, "portalRequirements": [0]}),
        new MapInfoBase(81, <MapInfoModel>{"id": 81, "portalRequirements": [0]}),
        new MapInfoBase(82, <MapInfoModel>{"id": 82, "portalRequirements": [0]}),
        new MapInfoBase(83, <MapInfoModel>{"id": 83, "portalRequirements": [0]}),
        new MapInfoBase(84, <MapInfoModel>{"id": 84, "portalRequirements": [0]}),
        new MapInfoBase(85, <MapInfoModel>{"id": 85, "portalRequirements": [0]}),
        new MapInfoBase(86, <MapInfoModel>{"id": 86, "portalRequirements": [0]}),
        new MapInfoBase(87, <MapInfoModel>{"id": 87, "portalRequirements": [0]}),
        new MapInfoBase(88, <MapInfoModel>{"id": 88, "portalRequirements": [0]}),
        new MapInfoBase(89, <MapInfoModel>{"id": 89, "portalRequirements": [0]}),
        new MapInfoBase(90, <MapInfoModel>{"id": 90, "portalRequirements": [0]}),
        new MapInfoBase(91, <MapInfoModel>{"id": 91, "portalRequirements": [0]}),
        new MapInfoBase(92, <MapInfoModel>{"id": 92, "portalRequirements": [0]}),
        new MapInfoBase(93, <MapInfoModel>{"id": 93, "portalRequirements": [0]}),
        new MapInfoBase(94, <MapInfoModel>{"id": 94, "portalRequirements": [0]}),
        new MapInfoBase(95, <MapInfoModel>{"id": 95, "portalRequirements": [0]}),
        new MapInfoBase(96, <MapInfoModel>{"id": 96, "portalRequirements": [0]}),
        new MapInfoBase(97, <MapInfoModel>{"id": 97, "portalRequirements": [0]}),
        new MapInfoBase(98, <MapInfoModel>{"id": 98, "portalRequirements": [0]}),
        new MapInfoBase(99, <MapInfoModel>{"id": 99, "portalRequirements": [0]}),
        new MapInfoBase(100, <MapInfoModel>{"id": 100, "portalRequirements": [1, 0]}),
        new MapInfoBase(101, <MapInfoModel>{"id": 101, "portalRequirements": [1000]}),
        new MapInfoBase(102, <MapInfoModel>{"id": 102, "portalRequirements": [4000]}),
        new MapInfoBase(103, <MapInfoModel>{"id": 103, "portalRequirements": [2000]}),
        new MapInfoBase(104, <MapInfoModel>{"id": 104, "portalRequirements": [3000, 100000]}),
        new MapInfoBase(105, <MapInfoModel>{"id": 105, "portalRequirements": [4000]}),
        new MapInfoBase(106, <MapInfoModel>{"id": 106, "portalRequirements": [6000]}),
        new MapInfoBase(107, <MapInfoModel>{"id": 107, "portalRequirements": [8000]}),
        new MapInfoBase(108, <MapInfoModel>{"id": 108, "portalRequirements": [11000]}),
        new MapInfoBase(109, <MapInfoModel>{"id": 109, "portalRequirements": [15000]}),
        new MapInfoBase(110, <MapInfoModel>{"id": 110, "portalRequirements": [18000]}),
        new MapInfoBase(111, <MapInfoModel>{"id": 111, "portalRequirements": [22000]}),
        new MapInfoBase(112, <MapInfoModel>{"id": 112, "portalRequirements": [35000]}),
        new MapInfoBase(113, <MapInfoModel>{"id": 113, "portalRequirements": [120000]}),
        new MapInfoBase(114, <MapInfoModel>{"id": 114, "portalRequirements": [1000]}),
        new MapInfoBase(115, <MapInfoModel>{"id": 115, "portalRequirements": [1000]}),
        new MapInfoBase(116, <MapInfoModel>{"id": 116, "portalRequirements": [250000]}),
        new MapInfoBase(117, <MapInfoModel>{"id": 117, "portalRequirements": [0]}),
        new MapInfoBase(118, <MapInfoModel>{"id": 118, "portalRequirements": [0]}),
        new MapInfoBase(119, <MapInfoModel>{"id": 119, "portalRequirements": [0]}),
        new MapInfoBase(120, <MapInfoModel>{"id": 120, "portalRequirements": [0]}),
        new MapInfoBase(121, <MapInfoModel>{"id": 121, "portalRequirements": [0]}),
        new MapInfoBase(122, <MapInfoModel>{"id": 122, "portalRequirements": [0]}),
        new MapInfoBase(123, <MapInfoModel>{"id": 123, "portalRequirements": [0]}),
        new MapInfoBase(124, <MapInfoModel>{"id": 124, "portalRequirements": [0]}),
        new MapInfoBase(125, <MapInfoModel>{"id": 125, "portalRequirements": [0]}),
        new MapInfoBase(126, <MapInfoModel>{"id": 126, "portalRequirements": [0]}),
        new MapInfoBase(127, <MapInfoModel>{"id": 127, "portalRequirements": [0]}),
        new MapInfoBase(128, <MapInfoModel>{"id": 128, "portalRequirements": [0]}),
        new MapInfoBase(129, <MapInfoModel>{"id": 129, "portalRequirements": [0]}),
        new MapInfoBase(130, <MapInfoModel>{"id": 130, "portalRequirements": [0]}),
        new MapInfoBase(131, <MapInfoModel>{"id": 131, "portalRequirements": [0]}),
        new MapInfoBase(132, <MapInfoModel>{"id": 132, "portalRequirements": [0]}),
        new MapInfoBase(133, <MapInfoModel>{"id": 133, "portalRequirements": [0]}),
        new MapInfoBase(134, <MapInfoModel>{"id": 134, "portalRequirements": [0]}),
        new MapInfoBase(135, <MapInfoModel>{"id": 135, "portalRequirements": [0]}),
        new MapInfoBase(136, <MapInfoModel>{"id": 136, "portalRequirements": [0]}),
        new MapInfoBase(137, <MapInfoModel>{"id": 137, "portalRequirements": [0]}),
        new MapInfoBase(138, <MapInfoModel>{"id": 138, "portalRequirements": [0]}),
        new MapInfoBase(139, <MapInfoModel>{"id": 139, "portalRequirements": [0]}),
        new MapInfoBase(140, <MapInfoModel>{"id": 140, "portalRequirements": [0]}),
        new MapInfoBase(141, <MapInfoModel>{"id": 141, "portalRequirements": [0]}),
        new MapInfoBase(142, <MapInfoModel>{"id": 142, "portalRequirements": [0]}),
        new MapInfoBase(143, <MapInfoModel>{"id": 143, "portalRequirements": [0]}),
        new MapInfoBase(144, <MapInfoModel>{"id": 144, "portalRequirements": [0]}),
        new MapInfoBase(145, <MapInfoModel>{"id": 145, "portalRequirements": [0]}),
        new MapInfoBase(146, <MapInfoModel>{"id": 146, "portalRequirements": [0]}),
        new MapInfoBase(147, <MapInfoModel>{"id": 147, "portalRequirements": [0]}),
        new MapInfoBase(148, <MapInfoModel>{"id": 148, "portalRequirements": [0]}),
        new MapInfoBase(149, <MapInfoModel>{"id": 149, "portalRequirements": [0]}),
        new MapInfoBase(150, <MapInfoModel>{"id": 150, "portalRequirements": [1, 0]}),
        new MapInfoBase(151, <MapInfoModel>{"id": 151, "portalRequirements": [20000]}),
        new MapInfoBase(152, <MapInfoModel>{"id": 152, "portalRequirements": [30000]}),
        new MapInfoBase(153, <MapInfoModel>{"id": 153, "portalRequirements": [50000]}),
        new MapInfoBase(154, <MapInfoModel>{"id": 154, "portalRequirements": [70000]}),
        new MapInfoBase(155, <MapInfoModel>{"id": 155, "portalRequirements": [100000]}),
        new MapInfoBase(156, <MapInfoModel>{"id": 156, "portalRequirements": [150000]}),
        new MapInfoBase(157, <MapInfoModel>{"id": 157, "portalRequirements": [250000]}),
        new MapInfoBase(158, <MapInfoModel>{"id": 158, "portalRequirements": [500000]}),
        new MapInfoBase(159, <MapInfoModel>{"id": 159, "portalRequirements": [700000]}),
        new MapInfoBase(160, <MapInfoModel>{"id": 160, "portalRequirements": [1000000]}),
        new MapInfoBase(161, <MapInfoModel>{"id": 161, "portalRequirements": [2000000]}),
        new MapInfoBase(162, <MapInfoModel>{"id": 162, "portalRequirements": [3000000]}),
        new MapInfoBase(163, <MapInfoModel>{"id": 163, "portalRequirements": [4000000]}),
        new MapInfoBase(164, <MapInfoModel>{"id": 164, "portalRequirements": [250]}),
        new MapInfoBase(165, <MapInfoModel>{"id": 165, "portalRequirements": [700]}),
        new MapInfoBase(166, <MapInfoModel>{"id": 166, "portalRequirements": [0]}),
        new MapInfoBase(167, <MapInfoModel>{"id": 167, "portalRequirements": [0]}),
        new MapInfoBase(168, <MapInfoModel>{"id": 168, "portalRequirements": [0]}),
        new MapInfoBase(169, <MapInfoModel>{"id": 169, "portalRequirements": [0]}),
        new MapInfoBase(170, <MapInfoModel>{"id": 170, "portalRequirements": [0]}),
        new MapInfoBase(171, <MapInfoModel>{"id": 171, "portalRequirements": [0]}),
        new MapInfoBase(172, <MapInfoModel>{"id": 172, "portalRequirements": [0]}),
        new MapInfoBase(173, <MapInfoModel>{"id": 173, "portalRequirements": [0]}),
        new MapInfoBase(174, <MapInfoModel>{"id": 174, "portalRequirements": [0]}),
        new MapInfoBase(175, <MapInfoModel>{"id": 175, "portalRequirements": [0]}),
        new MapInfoBase(176, <MapInfoModel>{"id": 176, "portalRequirements": [0]}),
        new MapInfoBase(177, <MapInfoModel>{"id": 177, "portalRequirements": [0]}),
        new MapInfoBase(178, <MapInfoModel>{"id": 178, "portalRequirements": [0]}),
        new MapInfoBase(179, <MapInfoModel>{"id": 179, "portalRequirements": [0]}),
        new MapInfoBase(180, <MapInfoModel>{"id": 180, "portalRequirements": [0]}),
        new MapInfoBase(181, <MapInfoModel>{"id": 181, "portalRequirements": [0]}),
        new MapInfoBase(182, <MapInfoModel>{"id": 182, "portalRequirements": [0]}),
        new MapInfoBase(183, <MapInfoModel>{"id": 183, "portalRequirements": [0]}),
        new MapInfoBase(184, <MapInfoModel>{"id": 184, "portalRequirements": [0]}),
        new MapInfoBase(185, <MapInfoModel>{"id": 185, "portalRequirements": [0]}),
        new MapInfoBase(186, <MapInfoModel>{"id": 186, "portalRequirements": [0]}),
        new MapInfoBase(187, <MapInfoModel>{"id": 187, "portalRequirements": [0]}),
        new MapInfoBase(188, <MapInfoModel>{"id": 188, "portalRequirements": [0]}),
        new MapInfoBase(189, <MapInfoModel>{"id": 189, "portalRequirements": [0]}),
        new MapInfoBase(190, <MapInfoModel>{"id": 190, "portalRequirements": [0]}),
        new MapInfoBase(191, <MapInfoModel>{"id": 191, "portalRequirements": [0]}),
        new MapInfoBase(192, <MapInfoModel>{"id": 192, "portalRequirements": [0]}),
        new MapInfoBase(193, <MapInfoModel>{"id": 193, "portalRequirements": [0]}),
        new MapInfoBase(194, <MapInfoModel>{"id": 194, "portalRequirements": [0]}),
        new MapInfoBase(195, <MapInfoModel>{"id": 195, "portalRequirements": [0]}),
        new MapInfoBase(196, <MapInfoModel>{"id": 196, "portalRequirements": [0]}),
        new MapInfoBase(197, <MapInfoModel>{"id": 197, "portalRequirements": [0]}),
        new MapInfoBase(198, <MapInfoModel>{"id": 198, "portalRequirements": [0]}),
        new MapInfoBase(199, <MapInfoModel>{"id": 199, "portalRequirements": [0]}),
        new MapInfoBase(200, <MapInfoModel>{"id": 200, "portalRequirements": [1, 0]})    
]
}