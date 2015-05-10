'use strict';

// This should be your main point of entry for your app

window.addEventListener('load', function() {
    var sceneGraphModule = createSceneGraphModule();
    var appContainer = document.getElementById('app-container');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var carNode = new sceneGraphModule.CarNode();
    var frontAxleNode = new sceneGraphModule.AxleNode(sceneGraphModule.FRONT_AXLE_PART);
    var backAxleNode = new sceneGraphModule.AxleNode(sceneGraphModule.BACK_AXLE_PART);
    var frontLeftTireNode = new sceneGraphModule.TireNode(sceneGraphModule.FRONT_LEFT_TIRE_PART);
    var frontRightTireNode = new sceneGraphModule.TireNode(sceneGraphModule.FRONT_RIGHT_TIRE_PART);
    var backLeftTireNode = new sceneGraphModule.TireNode(sceneGraphModule.BACK_LEFT_TIRE_PART);
    var backRightTireNode = new sceneGraphModule.TireNode(sceneGraphModule.BACK_RIGHT_TIRE_PART);
    var mouseDown = false;
    var startMousePos;
    var centerPos = {x:0, y:0};
    var selectedNode;
    frontAxleNode.addChild(frontLeftTireNode);
    frontAxleNode.addChild(frontRightTireNode);
    backAxleNode.addChild(backLeftTireNode);
    backAxleNode.addChild(backRightTireNode);
    carNode.addChild(frontAxleNode);
    carNode.addChild(backAxleNode);

    carNode.startPositionTransform.setTransform(1,0,0,1,400,300);
    updateCenter();
    carNode.render(context);

    function pointToArray(point) {
        var array = [];
        array.push(point.x);
        array.push(point.y);
        return array;
    }

    function arrayToPoint(array) {
        return {x:array[0], y:array[1]};
    }

    function transformPoint(transMat, point) {
        var array = [];
        transMat.transform(pointToArray(point),0,array,0,1);
        return arrayToPoint(array);
    }

    function updateCenter() {
        centerPos = {x:0, y:0};
        centerPos = transformPoint(carNode.startPositionTransform, centerPos);
    }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        var deg;
        if (!mouseDown) {
            var response = carNode.pointInObject(mousePos);
            if (response == "CAR_H" || response == "TIRE_H") {
                document.body.style.cursor = "ew-resize";
            } else if (response == "CAR_V") {
                document.body.style.cursor = "ns-resize";
            } else if (response == "CAR") {
                document.body.style.cursor = "move";
            } else if (response == "CAR_R" || response == "TIRE_R") {
                document.body.style.cursor = "pointer";
            } else {
                document.body.style.cursor = "default";
            }
        } else if (selectedNode) {
            context.clearRect ( 0 , 0 , canvas.width, canvas.height );
            updateCenter();
            if (selectedNode == "CAR_H") {
                sceneGraphModule.stretchCarWidth(carNode.horizontalDistInCarCord(startMousePos,mousePos));
            } else if (selectedNode == "CAR_V") {
                sceneGraphModule.stretchCarHeight(carNode.verticalDistInCarCord(startMousePos,mousePos));
            } else if (selectedNode == "CAR") {
                carNode.startPositionTransform.preTranslate(mousePos.x-startMousePos.x, mousePos.y-startMousePos.y);
            } else if (selectedNode == "CAR_R") {
                deg =  Math.atan2(startMousePos.x-centerPos.x, startMousePos.y-centerPos.y)
                        - Math.atan2(mousePos.x-centerPos.x, mousePos.y-centerPos.y);
                carNode.objectTransform.preRotate(deg,0,0);
            } else if (selectedNode == "TIRE_H") {
                sceneGraphModule.stretchAxelWidth(carNode.horizontalDistInCarCord(startMousePos,mousePos));
            } else if (selectedNode == "TIRE_R") {
                deg =  Math.atan2(startMousePos.x-centerPos.x, startMousePos.y-centerPos.y)
                    - Math.atan2(mousePos.x-centerPos.x, mousePos.y-centerPos.y);
                frontLeftTireNode.rotateAroundCenter(deg);
                frontRightTireNode.rotateAroundCenter(deg);
            }
            carNode.render(context);
            startMousePos = mousePos;
        }
    });

    canvas.addEventListener('mousedown', function(evt) {
        mouseDown = true;
        startMousePos = getMousePos(canvas, evt);
        selectedNode = carNode.pointInObject(startMousePos);
        if (selectedNode == "CAR_H") {
            document.body.style.cursor = "ew-resize";
        } else if (selectedNode == "CAR_V") {
            document.body.style.cursor = "ns-resize";
        } else if (selectedNode == "CAR") {
            document.body.style.cursor = "move";
        } else if (selectedNode == "CAR_R") {
            document.body.style.cursor = "pointer";
        } else if (selectedNode == "TIRE_H") {
            document.body.style.cursor = "ew-resize";
        } else if (selectedNode == "TIRE_R") {
            document.body.style.cursor = "pointer";
        } else {
            document.body.style.cursor = "default";
        }
    });

    canvas.addEventListener('mouseup', function(evt) {
        mouseDown = false;
        updateCenter();
        document.body.style.cursor = "default";
    });

    canvas.addEventListener('mouseout', function(evt) {
        mouseDown = false;
        updateCenter();
        document.body.style.cursor = "default";
    });
});
