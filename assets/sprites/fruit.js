cc.Class({
    extends: cc.Component,

    properties: {
        id: 0,
    },

    onLoad () {
        this.isPlay = false;
        this.isContact = false;
        this.canContact = false;
    },

    init (data) {
        this.id = data.id;
        const sp = this.node.getComponent(cc.Sprite);
        sp.spriteFrame = data.iconSF;
    },
    start(){},
    
    onBeginContact (contact, self, other) {
        if(other.node && self.node){
            const sc = self.node.getComponent('fruit');
            const oc = other.node.getComponent('fruit');
            const spos = self.node.position;
            const opos = other.node.position;
            if (sc && oc && sc.id == oc.id) {
                if (spos.y >= opos.y) {
                    self.node.emit('sameContact', {self, other});
                }   
            }
        }   
    },

    onPreSolve (contact, self, other) {
        if(other.node.group == 'wall' && this.isPlay === false){
            this.isPlay = true;
            const audio = this.node.parent.getComponent('game').knockAudio;
            cc.audioEngine.play(audio, false, 1);
        }
    },
});
