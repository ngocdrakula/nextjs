const room3 = {
    id: 1,
    name: "Phòng khách 1",
    type: "livingroom",
    icon: "/temps/3.icon.jpg",
    image: "/temps/3.tranparent.png",
    shadow: "/temps/3.bong.png",
    shadow_matt: "/temps/3.no.png",
    surfaces: [
        {
            0: "1",//doi dien
            1: "-32.1",
            2: "-16.8",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "5000",
            8: "5000",
            9: "13.9",
            10: "13.9",
            11: [
                ["247", "0"],
                ["1303", "0"],
                ["1303", "566"],
                ["236", "566"],
                ["247", "0"]
            ],
            176: "wall",
            cameraFov: "40",
            viewVerticalOffset: "-163",
            viewHorizontalOffset: "0"
        },
        {
            0: "2",//phai
            1: "29.9",
            2: "-16.8",
            3: "0",
            4: "0",
            5: "-87.5",
            6: "0",
            7: "4000",
            8: "4000",
            9: "13.9",
            10: "13.9",
            11: [
                ["1303", "0"],
                ["1600", "0"],
                ["1600", "571"],
                ["1303", "430"],
                ["1303", "0"]
            ],
            176: "wall",
            cameraFov: "40",
            viewVerticalOffset: "-163",
            viewHorizontalOffset: "0"
        },
        {
            0: "3",//san
            1: "-32.1",
            2: "-16.5",
            3: "0",
            4: "-90.7",
            5: "0",
            6: "0",
            7: "5000",
            8: "5000",
            9: "13.9",
            10: "13.9",
            11: [
                ["230", "566"],
                ["1082", "566"],
                ["1209", "801"],
                ["1600", "812"],
                ["1600", "900"],
                ["0", "900"],
                ["0", "677"]
            ],
            176: "floor",
            cameraFov: "40",
            viewVerticalOffset: "-163",
            viewHorizontalOffset: "0"
        }
    ],
    enabled: 1,
    created_at: "2017-07-12 07:00:00",
    updated_at: "2017-09-26 15:42:58",
    surfaceTypes: {
        wall: "wall",
        floor: "floor",
        furniture: "furniture",
        counter: "counter"
    }
}
export default room3