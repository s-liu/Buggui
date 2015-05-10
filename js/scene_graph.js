'use strict';

/**
 * A function that creates and returns the scene graph classes and constants.
 */
function createSceneGraphModule() {

    // Part names. Use these to name your different nodes
    var CAR_PART = 'CAR_PART';
    var FRONT_AXLE_PART = 'FRONT_AXLE_PART';
    var BACK_AXLE_PART = 'BACK_AXLE_PART';
    var FRONT_LEFT_TIRE_PART = 'FRONT_LEFT_TIRE_PART';
    var FRONT_RIGHT_TIRE_PART = 'FRONT_RIGHT_TIRE_PART';
    var BACK_LEFT_TIRE_PART = 'BACK_LEFT_TIRE_PART';
    var BACK_RIGHT_TIRE_PART = 'BACK_RIGHT_TIRE_PART';
    var BORDER_LENGTH = 4;
    var MIN_CAR_WIDTH = 25;
    var MAX_CAR_WIDTH = 150;
    var MIN_CAR_HEIGHT = 50;
    var MAX_CAR_HEIGHT = 200;
    var MIN_AXEL_LENGTH = 5;
    var MAX_AXEL_LENGTH = 75;
    var CAR_BODY_WIDTH = 50;
    var CAR_BODY_HEIGHT = 100;
    var AXEL_LENGTH = 5;
    var AXEL_TO_BUMPER = 15;
    var TIRE_WIDTH = 10;
    var TIRE_HEIGHT = 25;
    var CAR_CONTROL_POINT_DIST = 20;
    var TIRE_CONTROL_POINT_DIST = 10;
    var CONTROL_POINT_RADIUS = 3;
    var car_width = CAR_BODY_WIDTH;
    var car_height = CAR_BODY_HEIGHT;

    var GraphNode = function() {
    };

    _.extend(GraphNode.prototype, {

        /**
         * Subclasses should call this function to initialize the object.
         *
         * @param startPositionTransform The transform that should be applied prior
         * to performing any rendering, so that the component can render in its own,
         * local, object-centric coordinate system.
         * @param nodeName The name of the node. Useful for debugging, but also used to uniquely identify each node
         */
        initGraphNode: function(startPositionTransform, nodeName) {

            this.nodeName = nodeName;

            // The transform that will position this object, relative
            // to its parent
            this.startPositionTransform = startPositionTransform;

            // Any additional transforms of this object after the previous transform
            // has been applied
            this.objectTransform = new AffineTransform();

            // Any child nodes of this node
            this.children = {};

            // Add any other properties you need, here
        },

        addChild: function(graphNode) {
            this.children[graphNode.nodeName] = graphNode;
        },

        /**
         * Swaps a graph node with a new graph node.
         * @param nodeName The name of the graph node
         * @param newNode The new graph node
         */
        replaceGraphNode: function(nodeName, newNode) {
            console.log(this);
            if (nodeName in this.children) {
                this.children[nodeName] = newNode;
            } else {
                _.each(
                    _.values(this.children),
                    function(child) {
                        child.replaceGraphNode(nodeName, newNode);
                    }
                );
            }
        },

        /**
         * Render this node using the graphics context provided.
         * Prior to doing any painting, the start_position_transform must be
         * applied, so the component can render itself in its local, object-centric
         * coordinate system. See the assignment specs for more details.
         *
         * This method should also call each child's render method.
         * @param context
         */
        render: function(context) {
        },

        /**
         * Determines whether a point lies within this object. Be sure the point is
         * transformed correctly prior to performing the hit test.
         */
        pointInObject: function(point) {
        }

    });

    var CarNode = function() {
        this.initGraphNode(new AffineTransform(), CAR_PART)
    };

    _.extend(CarNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            var inverseMatrix = this.startPositionTransform.createInverse();
            var inverseObjectMatrix = this.objectTransform.createInverse();
            var frontOffset = {x:0,y:-car_height/2};
            var backOffset = {x:0,y:car_height/2};

            frontOffset = transformPoint(this.objectTransform, frontOffset);
            backOffset = transformPoint(this.objectTransform, backOffset);

            context.transform(
                this.startPositionTransform.m00_,
                this.startPositionTransform.m10_,
                this.startPositionTransform.m01_,
                this.startPositionTransform.m11_,
                this.startPositionTransform.m02_,
                this.startPositionTransform.m12_);

            this.children[FRONT_AXLE_PART].startPositionTransform
                = this.objectTransform.clone().preTranslate(frontOffset.x, frontOffset.y).translate(0,AXEL_TO_BUMPER);
            this.children[FRONT_AXLE_PART].render(context);

            this.children[BACK_AXLE_PART].startPositionTransform
                = this.objectTransform.clone().preTranslate(backOffset.x, backOffset.y).translate(0,-AXEL_TO_BUMPER);
            this.children[BACK_AXLE_PART].render(context);

            context.transform(
                this.objectTransform.m00_,
                this.objectTransform.m10_,
                this.objectTransform.m01_,
                this.objectTransform.m11_,
                this.objectTransform.m02_,
                this.objectTransform.m12_);

            /*context.fillStyle = "black";
            context.fillRect(-car_width/2,-car_height/2,car_width,car_height);
            context.fillStyle = "#3333FF";
            context.fillRect(
                -car_width/2+BORDER_LENGTH,
                -car_height/2+BORDER_LENGTH,
                car_width-2*BORDER_LENGTH,
                car_height-2*BORDER_LENGTH);*/

            context.beginPath();
            context.fillStyle = "#3333FF";
            context.rect(
                -car_width/2,
                -car_height/2,
                car_width,
                car_height);
            context.fill();
            context.lineWidth = BORDER_LENGTH;
            context.strokeStyle = 'black';
            context.stroke();

            //front window
            context.beginPath();
            context.rect(
                -car_width/CAR_BODY_WIDTH*18,
                -car_height/CAR_BODY_HEIGHT*20,
                car_width/CAR_BODY_WIDTH*36,
                car_height/CAR_BODY_HEIGHT*15);
            context.fillStyle = 'white';
            context.fill();
            context.lineWidth = 2;
            context.strokeStyle = 'black';
            context.stroke();

            //back window
            context.beginPath();
            context.rect(
                -car_width/CAR_BODY_WIDTH*16,
                car_height/CAR_BODY_HEIGHT*30,
                car_width/CAR_BODY_WIDTH*32,
                car_height/CAR_BODY_HEIGHT*10);
            context.fillStyle = 'white';
            context.fill();
            context.lineWidth = 2;
            context.strokeStyle = 'black';
            context.stroke();

            //lining
            context.beginPath();
            context.moveTo(-car_width/CAR_BODY_WIDTH*12,-car_height/2);
            context.lineTo(
                -car_width/CAR_BODY_WIDTH*18,
                -car_height/CAR_BODY_HEIGHT*20
            );
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();

            context.beginPath();
            context.moveTo(car_width/CAR_BODY_WIDTH*12,-car_height/2);
            context.lineTo(
                car_width/CAR_BODY_WIDTH*18,
                -car_height/CAR_BODY_HEIGHT*20
            );
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();

            context.beginPath();
            context.moveTo(
                -car_width/CAR_BODY_WIDTH*18,
                -car_height/CAR_BODY_HEIGHT*5
            );
            context.lineTo(
                -car_width/CAR_BODY_WIDTH*16,
                car_height/CAR_BODY_HEIGHT*30
            );
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();

            context.beginPath();
            context.moveTo(
                car_width/CAR_BODY_WIDTH*18,
                -car_height/CAR_BODY_HEIGHT*5
            );
            context.lineTo(
                car_width/CAR_BODY_WIDTH*16,
                car_height/CAR_BODY_HEIGHT*30
            );
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();

            context.beginPath();
            context.moveTo(-car_width/2,car_height/2);
            context.lineTo(
                -car_width/CAR_BODY_WIDTH*16,
                car_height/CAR_BODY_HEIGHT*40
            );
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();

            context.beginPath();
            context.moveTo(car_width/2,car_height/2);
            context.lineTo(
                car_width/CAR_BODY_WIDTH*16,
                car_height/CAR_BODY_HEIGHT*40
            );
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();

            //head lights
            context.beginPath();
            context.rect(
                -car_width/2+BORDER_LENGTH,
                -car_height/2+BORDER_LENGTH,
                car_width/CAR_BODY_WIDTH*8,
                car_height/CAR_BODY_HEIGHT*3);
            context.fillStyle = 'white';
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();

            context.beginPath();
            context.rect(
                car_width/2-BORDER_LENGTH-car_width/CAR_BODY_WIDTH*8,
                -car_height/2+BORDER_LENGTH,
                car_width/CAR_BODY_WIDTH*8,
                car_height/CAR_BODY_HEIGHT*3);
            context.fillStyle = 'white';
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();

            //tire control point
            context.beginPath();
            context.arc(0, -car_height/2+TIRE_CONTROL_POINT_DIST, CONTROL_POINT_RADIUS, 0, 2 * Math.PI, false);
            context.fillStyle = '#FFD633';
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();

            //car control point
            context.beginPath();
            context.arc(0, -car_height/2+CAR_CONTROL_POINT_DIST, CONTROL_POINT_RADIUS, 0, 2 * Math.PI, false);
            context.fillStyle = '#70DB70';
            context.fill();
            context.strokeStyle = 'black';
            context.stroke();


            context.transform(
                inverseObjectMatrix.m00_,
                inverseObjectMatrix.m10_,
                inverseObjectMatrix.m01_,
                inverseObjectMatrix.m11_,
                inverseObjectMatrix.m02_,
                inverseObjectMatrix.m12_
            );

            context.transform(
                inverseMatrix.m00_,
                inverseMatrix.m10_,
                inverseMatrix.m01_,
                inverseMatrix.m11_,
                inverseMatrix.m02_,
                inverseMatrix.m12_
            );

        },

        // Overrides parent method
        pointInObject: function(point) {
            var inverseMatrix = this.startPositionTransform.createInverse();
            var inverseObjectMatrix = this.objectTransform.createInverse();
            var controlPoint = {x:car_width/2, y:CAR_CONTROL_POINT_DIST};
            var tireControlPoint = {x:car_width/2, y:TIRE_CONTROL_POINT_DIST};

            var hitDetected;
            var pointAfter = transformPoint(inverseMatrix, point);

            hitDetected = this.children[FRONT_AXLE_PART].pointInObject(pointAfter);
            if (hitDetected) {
                return hitDetected;
            }
            hitDetected = this.children[BACK_AXLE_PART].pointInObject(pointAfter);
            if (hitDetected) {
                return hitDetected;
            }

            pointAfter = transformPoint(inverseObjectMatrix, pointAfter);
            pointAfter = {x:pointAfter.x+car_width/2, y:pointAfter.y+car_height/2};
            console.log("xPos: "+pointAfter.x+", yPos: "+pointAfter.y);

            if (calcPointDistance(pointAfter, controlPoint) <= CONTROL_POINT_RADIUS) {
                return "CAR_R";
            }
            if (calcPointDistance(pointAfter, tireControlPoint) <= CONTROL_POINT_RADIUS) {
                return "TIRE_R";
            }
            if (BORDER_LENGTH <= pointAfter.x && pointAfter.x <= car_width - BORDER_LENGTH &&
                BORDER_LENGTH <= pointAfter.y && pointAfter.y <= car_height - BORDER_LENGTH) {
                return "CAR";
            }
            if (0 <= pointAfter.x && pointAfter.x <= car_width &&
                BORDER_LENGTH <= pointAfter.y && pointAfter.y <= car_height - BORDER_LENGTH) {
                return "CAR_H";
            }
            if (0 <= pointAfter.x && pointAfter.x <= car_width &&
                0 <= pointAfter.y && pointAfter.y <= car_height) {
                return "CAR_V";
            }
            return "NONE";

        },

        horizontalDistInCarCord: function(p1, p2) {
            p1 = transformPoint(this.startPositionTransform.createInverse(), p1);
            p1 = transformPoint(this.objectTransform.createInverse(), p1);
            p2 = transformPoint(this.startPositionTransform.createInverse(), p2);
            p2 = transformPoint(this.objectTransform.createInverse(), p2);
            if ((p1.x > 0 && p2.x > p1.x) || (p1.x < 0 && p2.x < p1.x)) {
                return calcPointDistance(p1, p2);
            } else {
                return -calcPointDistance(p1, p2);
            }
        },

        verticalDistInCarCord: function(p1, p2) {
            p1 = transformPoint(this.startPositionTransform.createInverse(), p1);
            p1 = transformPoint(this.objectTransform.createInverse(), p1);
            p2 = transformPoint(this.startPositionTransform.createInverse(), p2);
            p2 = transformPoint(this.objectTransform.createInverse(), p2);
            if ((p1.y > 0 && p2.y > p1.y) || (p1.y < 0 && p2.y < p1.y)) {
                return calcPointDistance(p1, p2);
            } else {
                return -calcPointDistance(p1, p2);
            }
        }
    });

    /**
     * @param axlePartName Which axle this node represents
     * @constructor
     */
    var AxleNode = function(axlePartName) {
        this.initGraphNode(new AffineTransform(), axlePartName);
    };

    _.extend(AxleNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            var inverseMatrix = this.startPositionTransform.createInverse();
            var inverseObjectMatrix = this.objectTransform.createInverse();
            var leftTire = this.children[FRONT_LEFT_TIRE_PART] || this.children[BACK_LEFT_TIRE_PART];
            var rightTire = this.children[FRONT_RIGHT_TIRE_PART] || this.children[BACK_RIGHT_TIRE_PART];

            context.transform(
                this.startPositionTransform.m00_,
                this.startPositionTransform.m10_,
                this.startPositionTransform.m01_,
                this.startPositionTransform.m11_,
                this.startPositionTransform.m02_,
                this.startPositionTransform.m12_
            );

            context.transform(
                this.objectTransform.m00_,
                this.objectTransform.m10_,
                this.objectTransform.m01_,
                this.objectTransform.m11_,
                this.objectTransform.m02_,
                this.objectTransform.m12_
            );

            context.fillStyle = "black";
            context.fillRect(
                -(car_width+2*AXEL_LENGTH)/2,
                -BORDER_LENGTH/2,
                car_width+2*AXEL_LENGTH,
                BORDER_LENGTH
            );

            context.transform(
                inverseObjectMatrix.m00_,
                inverseObjectMatrix.m10_,
                inverseObjectMatrix.m01_,
                inverseObjectMatrix.m11_,
                inverseObjectMatrix.m02_,
                inverseObjectMatrix.m12_
            );

            leftTire.startPositionTransform.setTransform(
                this.objectTransform.m00_,
                this.objectTransform.m01_,
                this.objectTransform.m10_,
                this.objectTransform.m11_,
                this.objectTransform.m02_,
                this.objectTransform.m12_
            ).preTranslate(-(car_width+2*AXEL_LENGTH)/2,0);

            leftTire.render(context);
            rightTire.startPositionTransform.setTransform(
                this.objectTransform.m00_,
                this.objectTransform.m01_,
                this.objectTransform.m10_,
                this.objectTransform.m11_,
                this.objectTransform.m02_,
                this.objectTransform.m12_
            ).preTranslate((car_width+2*AXEL_LENGTH)/2,0);
            rightTire.render(context);

            context.transform(
                inverseMatrix.m00_,
                inverseMatrix.m10_,
                inverseMatrix.m01_,
                inverseMatrix.m11_,
                inverseMatrix.m02_,
                inverseMatrix.m12_
            );
        },

        // Overrides parent method
        pointInObject: function(point) {
            // User can't select axles
            var inverseMatrix = this.startPositionTransform.createInverse();
            var leftTire = this.children[FRONT_LEFT_TIRE_PART] || this.children[BACK_LEFT_TIRE_PART];
            var rightTire = this.children[FRONT_RIGHT_TIRE_PART] || this.children[BACK_RIGHT_TIRE_PART];
            var hitDetected;
            var pointAfter = transformPoint(inverseMatrix, point);
            hitDetected = leftTire.pointInObject(pointAfter);
            if (hitDetected) {
                return hitDetected;
            }
            hitDetected = rightTire.pointInObject(pointAfter);
            if (hitDetected) {
                return hitDetected;
            }
            return false;
        }
    });

    /**
     * @param tirePartName Which tire this node represents
     * @constructor
     */
    var TireNode = function(tirePartName) {
        this.initGraphNode(new AffineTransform(), tirePartName);
    };

    _.extend(TireNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            var inverseMatrix = this.startPositionTransform.createInverse();
            var inverseObjectMatrix = this.objectTransform.createInverse();
            context.transform(
                this.startPositionTransform.m00_,
                this.startPositionTransform.m10_,
                this.startPositionTransform.m01_,
                this.startPositionTransform.m11_,
                this.startPositionTransform.m02_,
                this.startPositionTransform.m12_
            );

            context.transform(
                this.objectTransform.m00_,
                this.objectTransform.m10_,
                this.objectTransform.m01_,
                this.objectTransform.m11_,
                this.objectTransform.m02_,
                this.objectTransform.m12_
            );

            context.fillStyle = "black";
            context.fillRect(-TIRE_WIDTH/2,-TIRE_HEIGHT/2,TIRE_WIDTH,TIRE_HEIGHT);

            context.transform(
                inverseObjectMatrix.m00_,
                inverseObjectMatrix.m10_,
                inverseObjectMatrix.m01_,
                inverseObjectMatrix.m11_,
                inverseObjectMatrix.m02_,
                inverseObjectMatrix.m12_
            );

            context.transform(
                inverseMatrix.m00_,
                inverseMatrix.m10_,
                inverseMatrix.m01_,
                inverseMatrix.m11_,
                inverseMatrix.m02_,
                inverseMatrix.m12_
            );
        },

        // Overrides parent method
        pointInObject: function(point) {
            var inverseMatrix = this.startPositionTransform.createInverse();
            var inverseObjectMatrix = this.objectTransform.createInverse();
            var pointAfter = transformPoint(inverseMatrix, point);
            pointAfter = transformPoint(inverseObjectMatrix, pointAfter);
            pointAfter = {x:pointAfter.x+TIRE_WIDTH/2, y:pointAfter.y+TIRE_HEIGHT/2};

            if (BORDER_LENGTH <= pointAfter.x && pointAfter.x <= TIRE_WIDTH - BORDER_LENGTH &&
                0 <= pointAfter.y && pointAfter.y <= TIRE_HEIGHT) {
                return "TIRE";
            } else if (0 <= pointAfter.x && pointAfter.x <= TIRE_WIDTH &&
                0 <= pointAfter.y && pointAfter.y <= TIRE_HEIGHT) {
                return "TIRE_H";
            }
            return false;
        },

        rotateAroundCenter: function(deg) {
            this.objectTransform.preRotate(deg,0,0);
            if (Math.acos(this.objectTransform.m00_) > Math.PI/4) {
               if (Math.asin(this.objectTransform.m10_) > Math.PI/4) {
                    this.objectTransform.setToRotation(Math.PI/4,0,0);
               } else {
                   this.objectTransform.setToRotation(-Math.PI/4,0,0);
               }
            }

        }
    });

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

    function calcPointDistance(p1, p2) {
        return Math.sqrt(Math.pow((p1.x-p2.x),2) + Math.pow((p1.y-p2.y),2));
    }

    function stretchCarWidth(s) {
        var temp = car_width+s*2;
        if (temp >= MIN_CAR_WIDTH && temp <= MAX_CAR_WIDTH ) {
            car_width = temp;
        }
    }

    function stretchCarHeight(s) {
        var temp = car_height+s*2;
        if (temp >= MIN_CAR_HEIGHT && temp <= MAX_CAR_HEIGHT ) {
            car_height = temp;
        }
    }

    function stretchAxelWidth(s) {
        var temp = AXEL_LENGTH+s;
        if (temp >= MIN_AXEL_LENGTH && temp <= MAX_AXEL_LENGTH ) {
            AXEL_LENGTH = temp;
        }
    }

    // Return an object containing all of our classes and constants
    return {
        GraphNode: GraphNode,
        CarNode: CarNode,
        AxleNode: AxleNode,
        TireNode: TireNode,
        CAR_PART: CAR_PART,
        FRONT_AXLE_PART: FRONT_AXLE_PART,
        BACK_AXLE_PART: BACK_AXLE_PART,
        FRONT_LEFT_TIRE_PART: FRONT_LEFT_TIRE_PART,
        FRONT_RIGHT_TIRE_PART: FRONT_RIGHT_TIRE_PART,
        BACK_LEFT_TIRE_PART: BACK_LEFT_TIRE_PART,
        BACK_RIGHT_TIRE_PART: BACK_RIGHT_TIRE_PART,
        CAR_BODY_WIDTH: car_width,
        CAR_BODY_HEIGHT: car_height,
        stretchCarWidth: stretchCarWidth,
        stretchCarHeight: stretchCarHeight,
        stretchAxelWidth: stretchAxelWidth
    };
}