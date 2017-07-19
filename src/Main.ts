class Main extends egret.DisplayObjectContainer {

    static stageWidth = 0;

    static stageHeight = 0;

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    private _playScene: PlayScene = null;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        fairygui.UIPackage.addPackage("Package1");
        this.stage.addChild(fairygui.GRoot.inst.displayObject);
        Main.stageWidth = this.stage.stageWidth;
        Main.stageHeight = this.stage.stageHeight;

        this._playScene = PlayScene.instance;
        this.addChild(this._playScene);
    }

    static createPanel(panelName: string): fairygui.GComponent {
        const p: fairygui.GComponent = fairygui.UIPackage.createObject("Package1", panelName).asCom;
        const stage = egret.Stage;
        p.viewWidth = Main.stageWidth;
        p.viewHeight = Main.stageHeight;
        return p;
    }

    static createComponent(name: string): fairygui.GComponent {
        return fairygui.UIPackage.createObject("Package1", name).asCom;
    }
}


/*
level 
1       1000
2       3500    2500
3       6000    2500
4       10000   4000
5       12000   2000
6       15000   3000
7       30000   15000
8       36000   6000
9       45000   9000
10      55000   10000
11      66000   11000
12      78000   12000
13      91000   13000
14      105000  14000
*/

/*
2 20
3 45
4 80
5 125
6 180
7 245
8 320
9 405
11 605
13 845
14 980
19 1805
29 4205
*/

/*
def test(num):
    if num == 2:
        return 20
    if num == 3:
        return 25
    if num == 4:
        return 45
    else:
        return (num - 1) * 10 + 5

def test1(num):
    if num == 2:
        return 20
    if num == 3:
        return 45
    r = 0
    for x in xrange(2, num + 1):
        r += test(x)
    return r - 10


print(test1(15))
*/
