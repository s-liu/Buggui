'use strict';

var expect = chai.expect;

describe('First unit test', function() {

    var sceneGraphModule = createSceneGraphModule();

    it('initGraphNode unit test for graphNode', function() {
        var graphNode = new sceneGraphModule.GraphNode();
        var transform = new AffineTransform();
        var initFnSpy = sinon.spy(graphNode, 'initGraphNode');
        graphNode.initGraphNode(transform, "testParentNode");
        expect(initFnSpy.called, 'initGraphNode function should be called').to.be.ok;
        expect(transform.equals(graphNode.startPositionTransform), 'startPositionTransform should be initialized').to.be.true;
        expect(transform.equals(graphNode.objectTransform), 'objectTransform should be initialized').to.be.true;
        expect(graphNode.nodeName, 'nodeName should be initialized').to.eql("testParentNode");
        expect(graphNode.children, 'children should be initialized').to.eql({});

    });

    it('addChild unit test for graphNode', function() {
        var parent = new sceneGraphModule.GraphNode();
        var child = new sceneGraphModule.GraphNode();
        var addChildFnSpy = sinon.spy(parent,'addChild');
        parent.initGraphNode(new AffineTransform(), "testParentNode");
        child.initGraphNode(new AffineTransform(), "testChildNode");
        parent.addChild(child);
        expect(addChildFnSpy.called, 'parent node addChild function should be called').to.be.ok;
        //console.log(parent.children["testChildNode"]);
        expect(parent.children[child.nodeName], 'parent node should contain added data').to.exist;
    });

    it('replaceGraphNode unit test for graphNode', function() {
        var parent = new sceneGraphModule.GraphNode();
        var child = new sceneGraphModule.GraphNode();
        var replacingChild = new sceneGraphModule.GraphNode();
        var addChildFnSpy = sinon.spy(parent,'addChild');
        var replaceChildSpy = sinon.spy(parent, 'replaceGraphNode');
        parent.initGraphNode(new AffineTransform(), "testParentNode");
        child.initGraphNode(new AffineTransform(), "testChildNode");
        replacingChild.initGraphNode(new AffineTransform().setToTranslation(1,1), child.nodeName);
        parent.addChild(child);
        expect(addChildFnSpy.called, 'parent node addChild function should be called').to.be.ok;
        expect(parent.children[child.nodeName], 'parent node should contain added data').to.exist;
        parent.replaceGraphNode(replacingChild.nodeName,replacingChild);
        expect(replaceChildSpy.called, 'parent node replaceChildNode function should be called').to.be.ok;
        expect(parent.children[child.nodeName], 'parent node should contain replaced data').to.exist;
        expect(parent.children[child.nodeName], 'replaced data should replace original data').to.eql(replacingChild);
    });

    it('replaceGraphNode unit test 2 for graphNode', function() {
        var parent = new sceneGraphModule.GraphNode();
        var child = new sceneGraphModule.GraphNode();
        var grandChild = new sceneGraphModule.GraphNode();
        var replacingChild = new sceneGraphModule.GraphNode();
        var addChildFnSpy = sinon.spy(parent,'addChild');
        var replaceChildSpy = sinon.spy(parent, 'replaceGraphNode');
        parent.initGraphNode(new AffineTransform(), "testParentNode");
        child.initGraphNode(new AffineTransform(), "testChildNode");
        grandChild.initGraphNode(new AffineTransform, "testGrandChildNode");
        replacingChild.initGraphNode(new AffineTransform().setToTranslation(1,1), grandChild.nodeName);
        parent.addChild(child);
        child.addChild(grandChild);
        expect(addChildFnSpy.called, 'parent node addChild function should be called').to.be.ok;
        expect(parent.children[child.nodeName], 'parent node should contain added data').to.exist;
        parent.replaceGraphNode(replacingChild.nodeName,replacingChild);
        expect(replaceChildSpy.called, 'parent node replaceChildNode function should be called').to.be.ok;
        expect(parent.children[child.nodeName], 'parent node should contain replaced data').to.exist;
        expect(parent.children[child.nodeName], 'childNode should not be affected').to.eql(child);
        expect(child.children[grandChild.nodeName], 'childNode should not be affected').to.eql(replacingChild);
    });

    it('render unit test for GraphNode', function(){
        var parent = new sceneGraphModule.CarNode();
        var fChild = new sceneGraphModule.AxleNode(sceneGraphModule.FRONT_AXLE_PART);
        var bChild = new sceneGraphModule.AxleNode(sceneGraphModule.BACK_AXLE_PART);
        var flChild = new sceneGraphModule.TireNode(sceneGraphModule.FRONT_LEFT_TIRE_PART);
        var frChild = new sceneGraphModule.TireNode(sceneGraphModule.FRONT_RIGHT_TIRE_PART);
        var blChild = new sceneGraphModule.TireNode(sceneGraphModule.BACK_LEFT_TIRE_PART);
        var brChild = new sceneGraphModule.TireNode(sceneGraphModule.BACK_RIGHT_TIRE_PART);
        parent.addChild(fChild);
        parent.addChild(bChild);
        fChild.addChild(flChild);
        fChild.addChild(frChild);
        bChild.addChild(blChild);
        bChild.addChild(brChild);
        var parentRender = sinon.spy(parent, "render");
        var fchildRender = sinon.spy(fChild, "render");
        var bchildRender = sinon.spy(bChild, "render");
        var flChildRender = sinon.spy(flChild, "render");
        var frChildRender = sinon.spy(frChild, "render");
        var blChildRender = sinon.spy(blChild, "render");
        var brChildRender = sinon.spy(brChild, "render");

        var fakeContext = function(){};
        _.extend(fakeContext.prototype, {
            transform: function(a,b,c,d,e,f){
                return;
            },

            fillStyle: function(){
                return;
            },

            fillRect: function(){
                return;
            },

            beginPath: function(){
                return;
            },

            rect: function(){
                return;
            },

            fill: function(){
                return;
            },

            moveTo: function(){
                return;
            },

            lineTo: function(){
                return;
            },

            stroke: function(){
                return;
            },

            arc: function(){
                return;
            }

        });

        parent.render(new fakeContext());
        expect(parentRender, 'parent node render should be called').to.be.calledOnce;
        expect(fchildRender, 'front child node render should be called').to.be.calledOnce;
        expect(bchildRender, 'back child node render should be called').to.be.calledOnce;
        expect(flChildRender, 'front left child node render should be called').to.be.calledOnce;
        expect(frChildRender, 'front right child node render should be called').to.be.calledOnce;
        expect(blChildRender, 'back left node render should be called').to.be.calledOnce;
        expect(brChildRender, 'back right node render should be called').to.be.calledOnce;

    });
});