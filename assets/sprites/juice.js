
const RandomInteger = function (e, t) {
    return Math.floor(Math.random() * (t - e) + e)
}

cc.Class({
    extends: cc.Component,

    properties: {
        particle: {
            default: null,
            type: cc.SpriteFrame,
        },
        circle: {
            default: null,
            type: cc.SpriteFrame,
        },
        slash: {
            default: null,
            type: cc.SpriteFrame,
        },
    },

    init (data) {
        this.particle = data.particle;
        this.circle = data.circle;
        this.slash = data.slash;
    },

    showJuice (pos, width) {
        for(let i = 0; i < 10; i++){
            const node = new cc.Node('Sprite');
            const sp = node.addComponent(cc.Sprite);

            sp.spriteFrame = this.particle;
            node.parent = this.node;

            const a = 359 * Math.random(),
                  i = 30 * Math.random() + width / 2,
                  l = cc.v2(Math.sin(a * Math.PI / 180) * i,Math.cos(a * Math.PI / 180) * i);
            node.scale = .5 * Math.random() + width / 100;
            const p = .5 * Math.random();

            node.position = pos;
            
            cc.tween(node)
                .by(p, {position: l})
                .to(.25, {scale: .3})
                .by(.25, {angle: RandomInteger(-360,360)})
                .to(.1,{position:cc.v2(node.x + l, node.y + l)}, {easing:'fade'})
                .start()
        }

        for(let f = 0; f < 20; f++){
            const node = new cc.Node('Sprite');
            const sp = node.addComponent(cc.Sprite);

            sp.spriteFrame = this.circle;
            node.parent = this.node;

            const a = 359 * Math.random(),
                  i = 30 * Math.random() + width / 2,
                  l = cc.v2(Math.sin(a * Math.PI / 180) * i, Math.cos(a * Math.PI / 180) * i);
            node.scale = .5 * Math.random() + width / 100;
            const p = .5 * Math.random();

            node.position = pos;

            cc.tween(node)
                .by(p, {position: l})
                .to(.5, {scale: .3})
                .to(.1,{position:cc.v2(node.x + l, node.y + l)}, {easing:'fade'})
                .start()

        }

        const node = new cc.Node('Sprite');
        const sp = node.addComponent(cc.Sprite);

        sp.spriteFrame = this.slash;
        node.parent = this.node;

        
        node.scale = 0;
        node.angle = RandomInteger(0, 360);
        node.position = pos;

        cc.tween(node)
                .to(.2, {scale: width / 150})
                .delay(.3)
                .to(.3, {scale:0})
                .start()
    },
});
