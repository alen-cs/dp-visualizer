const { createApp, ref, reactive } = Vue;

createApp({
    setup() {
        const tabs = [
            { id: 'basic', name: '基础 DP (爬楼梯)' },
            { id: 'complete', name: '完全背包 (正序演示)' },
            { id: 'advanced', name: '多重背包与进阶' },
            { id: 'problems', name: '题库与解析' }
        ];
        const currentTab = ref('basic');

        // --- 1. 基础 DP 状态管理 ---
        const basic = reactive({
            dp: [1, 1, 0, 0, 0, 0, 0, 0], 
            curI: 2,
            finished: false, playing: false, timer: null,
            text: "初始化: $dp[0]=1, dp[1]=1$ (0阶1种，1阶1种)。点击下一步计算。"
        });

        const resetBasic = () => {
            basic.dp = [1, 1, 0, 0, 0, 0, 0, 0];
            basic.curI = 2; basic.finished = false; basic.playing = false;
            clearInterval(basic.timer);
            basic.text = "已重置。等待计算。";
        };

        const stepBasic = () => {
            if(basic.finished) return;
            let i = basic.curI;
            basic.dp[i] = basic.dp[i-1] + basic.dp[i-2];
            basic.text = `计算 $dp[${i}]$: 取决于爬1阶($dp[${i-1}]=${basic.dp[i-1]}$) + 爬2阶($dp[${i-2}]=${basic.dp[i-2]}$) = <b>${basic.dp[i]}</b>`;
            
            if(i < 7) basic.curI++;
            else { basic.finished = true; clearInterval(basic.timer); basic.text += " - 演示结束！"; }
        };

        const playBasic = () => {
            basic.playing = !basic.playing;
            if(basic.playing) basic.timer = setInterval(stepBasic, 800);
            else clearInterval(basic.timer);
        };

        const getBasicClass = (i) => {
            if(basic.finished) return '';
            if(i === basic.curI) return 'active-cell';
            if(i === basic.curI - 1 || i === basic.curI - 2) return 'dependency-cell';
            return '';
        };

        // --- 2. 完全背包状态管理 ---
        const itemsComp = [{w:2, v:3}, {w:3, v:4}];
        const capComp = 6;
        const comp = reactive({
            dp: Array(7).fill(0),
            curI: 1, curW: 2, 
            finished: false, playing: false, timer: null,
            text: "点击下一步体验<b>正序遍历</b>的魅力。"
        });

        const resetComplete = () => {
            comp.dp = Array(7).fill(0);
            comp.curI = 1; comp.curW = itemsComp[0].w;
            comp.finished = false; comp.playing = false;
            clearInterval(comp.timer);
            comp.text = "已重置。准备计算物品 1。注意游标从左向右移动！";
        };

        const stepComplete = () => {
            if(comp.finished) return;
            let i = comp.curI, w = comp.curW, item = itemsComp[i-1];

            let notTake = comp.dp[w];
            let take = comp.dp[w - item.w] + item.v; 
            comp.dp[w] = Math.max(notTake, take);
            
            comp.text = `物品 ${i}(重${item.w}) 容量 ${w}: 原值 ${notTake}，<b>再装一个</b>得 ${take}。更新为 <b>${comp.dp[w]}</b>`;

            if(comp.curW < capComp) {
                comp.curW++;
            } else {
                if(comp.curI < itemsComp.length) {
                    comp.curI++;
                    comp.curW = itemsComp[comp.curI - 1].w;
                } else {
                    comp.finished = true; clearInterval(comp.timer); comp.text = "完全背包演示结束！";
                }
            }
        };

        const playComplete = () => {
            comp.playing = !comp.playing;
            if(comp.playing) comp.timer = setInterval(stepComplete, 1000);
            else clearInterval(comp.timer);
        };

        const getCompClass = (w) => {
            if(comp.finished) return '';
            if(w === comp.curW) return 'active-cell';
            let item = itemsComp[comp.curI-1];
            if(w === comp.curW - item.w) return 'dependency-cell';
            return '';
        };

        return {
            tabs, currentTab,
            basic, stepBasic, playBasic, resetBasic, getBasicClass,
            comp, stepComplete, playComplete, resetComplete, getCompClass
        };
    }
}).mount('#app');