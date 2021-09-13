
const FruitItem = cc.Class({
    name: 'FruitItem',
    properties:{
        id: 0,
        iconSF: cc.SpriteFrame,
    }
});

const JuiceItem = cc.Class({
    name: 'JuiceItem',
    properties:{
        id: 0,
        particle: cc.SpriteFrame,
        circle: cc.SpriteFrame,
        slash: cc.SpriteFrame,
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        fruits: {
            default: [],
            type: FruitItem,
        },

        juices: {
            default: [],
            type: JuiceItem,
        },

        fruitPrefab: {
            default: null,
            type: cc.Prefab,
        },

        juicesPrefab: {
            default: null,
            type: cc.Prefab,
        },
        scoreLabel: {
            default: null,
            type: cc.Label,
        },

        boomAudio: {
            default: null,
            type:cc.AudioClip,
        },

        knockAudio: {
            default: null,
            type:cc.AudioClip,
        },

        waterAudio: {
            default: null,
            type:cc.AudioClip,
        },
    },

    onLoad () {
        this.initPhysics();
        this.isFall = false;
        this.currentFruit = null;
        this.isCreating = false;
        this.fruitCount = 0;
        this.score = 0;
        
        this.node.on('touchstart', this.onTouchStart, this);
        this.node.on('touchend', this.onTouchEnd, this)
        this.node.on('touchmove', this.onTouchMove, this);
        // this.node.on('mousemove',this.onMouseMove,this);

        this.initFruit();

        // this.node.addChild(cc.instantiate(this.fruitPrefab));
    },

    initPhysics () {
        //打开物理组件
        const instance = cc.director.getPhysicsManager();
        instance.enabled = true;
        // instance.debugDrawFlags = true;
        instance.gravity = cc.v2(0, -960);

        //开启碰撞组件
        const collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;

        //设置碰撞区域
            //获取长宽
        let width = this.node.width;
        let height = this.node.height;

        let node = new cc.Node();

        let body= node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;

            //设置碰撞箱具体位置大小
        const _addBound = (node, x, y, width, height) => {
            let collider = node.addComponent(cc.PhysicsBoxCollider);
            collider.offset.x = x;
            collider.offset.y = y;
            collider.size.width = width;
            collider.size.height = height;
            if(y < 0){
                node.group = 'wall';
            }
        }
        _addBound(node, 0, -height / 2 + 44, width, 1);
        _addBound(node, 0, height / 2, width, 1);
        _addBound(node, width / 2, 0, 1, height);
        _addBound(node, -width / 2, 0, 1, height);
        node.parent = this.node;
    },

    //触摸监听
    onTouchStart (e) {
        // if(this.isCreating) return;
        // this.isCreating = true;

        // const {width, height} = this.node;

        // const fruit = this.currentFruit;

        // cc.tween(fruit)
        //     .to(0.1,{position: cc.v2(fruit.x,400)},{easing: 'cubicIn'})
        //     .call(() => {
        //         //开启物理组件
        //         this.startFruitPhysics(fruit);
        //         this.isFall = true;
        //         // cc.log(fruit.x);
        //     })
        //     .call(() => {
        //         this.scheduleOnce(() => {
        //             //重新生成下一个水果
        //             const nextId = this.getNextFruitId();
        //             this.initFruit(nextId);
        //             this.isCreating = false;
        //             this.isFall = false;
        //         },1)
        //     })
        //     .start();
        
    },
    
    onTouchEnd (e) {
        if(this.isCreating) return;
        this.isCreating = true;

        const {width, height} = this.node;

        const fruit = this.currentFruit;

        cc.tween(fruit)
            .to(0.1,{position: cc.v2(fruit.x,400)},{easing: 'cubicIn'})
            .call(() => {
                //开启物理组件
                this.startFruitPhysics(fruit);
                this.isFall = true;
                // cc.log(fruit.x);
            })
            .call(() => {
                this.scheduleOnce(() => {
                    //重新生成下一个水果
                    const nextId = this.getNextFruitId();
                    this.initFruit(nextId);
                    this.isCreating = false;
                    this.isFall = false;
                },1)
            })
            .start();
    },

    //碰撞监听
    onContactCollider ({self, other}) {
        other.node.off('sameContact');
        const Id = other.getComponent('fruit').id;
        cc.log(Id);

        //回收到对象池
        
        const {x, y} = other.node;

        this.createJuice(Id, cc.v2({x, y}), other.node.width);
        
        this.addScore(Id);

        
        const nextId = Id + 1;
        if (Id < 11) {
            let newfruit = this.createFruitPos(x, y, nextId);
            this.startFruitPhysics(newfruit)
            newfruit.scale = 0
            
            self.node.active = false;
            other.node.active = false;

            self.node.removeFromParent(true);
            other.node.removeFromParent(true);
            
            cc.tween(newfruit)
                .to(.5, {scale: 0.6}, {easing: "backOut"})
                .start()
        }
    },

    createJuice(id, pos, n){

        cc.audioEngine.play(this.boomAudio, false, 1);
        cc.audioEngine.play(this.waterAudio, false, 1);

        let juice = cc.instantiate(this.juicesPrefab);
        this.node.addChild(juice);

        const config = this.juices[id - 1];
        const instance = juice.getComponent('juice');
        instance.init(config);
        instance.showJuice(pos, n);
    },

    onTouchMove (e) {
        if (this.isFall) return;
        this.Touchx = e.getLocationX();
        this.currentFruit.x = this.Touchx - this.node.width / 2;
    },

    // onMouseMove (e) {
    //     if (this.isFall) return;
    //     this.mousex = e.getLocationX();
    //     this.currentFruit.x = this.mousex - this.node.width / 2;
    // },

    startFruitPhysics (fruit) {
        fruit.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        const physicsCircleCollider = fruit.getComponent(cc.PhysicsCircleCollider);
        physicsCircleCollider.radius = fruit.height / 2;
        physicsCircleCollider.apply();
    },

    createFruit (num) {
        let fruit = cc.instantiate(this.fruitPrefab);
        const config = this.fruits[num - 1];

        fruit.getComponent('fruit').init({
            id: config.id,
            iconSF: config.iconSF,
        });

        fruit.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        fruit.getComponent(cc.PhysicsCircleCollider).radius = 0;

        this.node.addChild(fruit);
        fruit.scale = 0.6;

        fruit.on('sameContact', this.onContactCollider.bind(this));

        return fruit;
    },

    createFruitPos (x, y, type = 1) {
        const fruit = this.createFruit(type);
        fruit.setPosition(cc.v2(x, y));
        return fruit;
    },

    getNextFruitId () {
        if(this.fruitCount < 3){
            return 1;
        } else if (this.fruitCount == 3) {
            return 2;
        } else {
            return Math.floor(Math.random() * 5) + 1;
        }
    },

    initFruit (id = 1) {
        this.fruitCount++;
        this.currentFruit = this.createFruitPos(0, 400, id);
    },

    addScore (Id) {
        this.score += Id;
        cc.log(this.score);
        this.scoreLabel.string = this.score;
    }
});
