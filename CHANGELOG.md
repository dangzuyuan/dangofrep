# CHANGELOG

## 2026-06-22

- 鏂板鐜鍙橀噺 backgroundcolor锛氭帶鍒?*琛ㄦ牸鍖哄煙**鑳屾櫙棰滆壊锛堜粎 ScrollArea 鍐呭鍖猴級锛岄粯璁ょ櫧鑹?
- 鏂板鐜鍙橀噺 subbackgroundcolor锛氭帶鍒?*鏃堕棿杞?琛ㄥご+閿氬畾鍖?*鑳屾櫙棰滆壊锛岄粯璁ょ櫧鑹?#fafafa
- 鏂板鐜鍙橀噺 mainfontsize锛氭帶鍒朵富浜嬩欢鏉″瓧浣撳ぇ灏忥紝鍊间负鏁板瓧锛坧x锛夛紝榛樿 11px
- 閫氳繃 DEBUG 鏃ュ織瀹氫綅 key 鎷煎啓闂锛堢敤鎴烽厤缃负 backgroupcolor锛夛紝缁熶竴涓?backgroundcolor
- 绉婚櫎 DEBUG 鏃ュ織锛屼唬鐮佹竻鐞嗗畬姣?
- 鍓簨浠?鎺掔彮浜嬩欢)涓嶉€忔槑鍖栵細opacity=1 + 绉婚櫎棰滆壊閫忔槑搴﹀悗缂€锛岄伩鍏嶈儗鏅壊骞叉壈
- 缃戞牸绾匡細#c8c8c8鈫?d9d9d9 + StaffColumn缃戞牸灞傚彸渚у姞borderRight=#d9d9d9锛屽垪闂寸旱绾垮彲瑙?
- 修复格线层叠顺序：改由内层 grid div(z-index:2)绘制，格线现位于副事件(z-index:1)之上、主事件(z-index:3)之下
- 格线延伸至时间轴：BodyAxisCell 多重背景(gridBg + subBgColor)，格线与列区域位置一致
- 删除列空状态"暂无安排"图标及文字，无事件时空列不显示内容

## 2026-06-18

- 淇绉诲姩绔椂闂磋酱婊戝姩锛氬浐瀹氬畾浣?闃绘柇婊氬姩閾?
- 淇iOS鏃堕棿杞存粦鍔ㄤ笌琛ㄥご瀵归綈锛歸ebkit鎯€ф粴鍔?鏄惧紡瀹藉害
- V7 iOS涓撳睘淇锛歟nabled gate + iOS妫€娴嬮殧绂籄ndroid锛岄浂褰卞搷
- **V8 宸ヤ笟绾?*锛歩OS/Android 鍙屽垎鏀粦鍔紝鍏ㄥ眬瀹堝崼+fixed瀹瑰櫒+杈圭紭閬僵
  - useScrollLock.js锛歩OS 瀹屾暣閫昏緫锛堝叏灞€瀹堝崼+鎵嬪姩scrollLeft+rAF鍔ㄩ噺锛夛紱Android `if(!isIOS) return` 闆剁洃鍚?
  - index.js: iOS 鍐?body.ios-app class
  - style.less: body.ios-app #app fixed + .ios-scroll-area padding-left:42px + .ios-edge-mask
  - TimeCalendar.jsx: iOS 涓撳睘 42px 閫忔槑杈圭紭閬僵 div
  - style.less: body.ios-app #app fixed + .ios-scroll-area padding-left:42px + transform
  - TimeCalendar.jsx: iOS 涓撳睘 42px 閫忔槑杈圭紭閬僵锛屾嫤鎴郴缁熶晶婊戣繑鍥炶Е鎽?

## 2026-06-17

## 2026-06-07

- 绉诲姩绔Е灞忓垱寤洪檷浣庣伒鏁忓害锛氶暱鎸?00ms + 绉诲姩10px鍙栨秷闃茶瑙?
- 鏄庨亾浜戝埛鏂拌鍥惧悗淇濈暀宸ュ叿鏍忔棩鏈燂紙sessionStorage鎸佷箙鍖朿urrentDate锛?
- 鏇存柊璁捐鏂规鏂囨。涓嶴ESSION鎺ョ画绗旇

# 瀹屾暣瀵硅瘽璁板綍

**椤圭洰**: 棰勭害鏃堕棿鐪嬫澘鏋舵瀯瑙ｈ€﹂噸鏋? 
**寮€濮嬫椂闂?*: 2026-05-30

---

## 瀵硅瘽1: 鍚姩宸ヤ綔娴?鈥?璁捐闃舵

**鐢ㄦ埛**: 鎸夊伐浣滄祦锛岃璁★細D:\AI\椤圭洰婧愮爜\鏄庨亾浜戞彃浠跺紑鍙慭棰勭害鐪嬫澘\棰勭害鐪嬫澘鏂扮増锛堣鍥惧睍绀鸿В鑰︼級\story\鍒濆闇€姹?md

**AI**: 璇嗗埆涓哄叏娴佺▼妯″紡锛堣璁♀啋瀹℃煡鈫掍慨鏀光啋楠岃瘉鈫掓彁浜わ級锛屽惎鍔ㄩ樁娈?璁捐Agent銆傝鍙栦簡椤圭洰缁撴瀯銆佸弬鑰冧唬鐮併€乥eta2婧愮爜銆丼TANDARD.md銆乀imeCalendar缁勪欢璋冪敤瑙勫垯绛夊叏閮ㄥ弬鑰冩枃浠躲€傚惎鍔ㄨ璁gent鐢熸垚璁捐鏂囨。銆?

**缁撴灉**: 璁捐鏂囨。淇濆瓨鑷?story/璁捐鏂囨。.md锛?91琛岋級锛屽寘鍚?灞傛灦鏋勩€?6涓縼绉绘ā鍧椼€?4澶勪唬鐮侀噸澶嶆秷闄ゃ€?闃舵14姝ュ疄鏂借鍒掋€?涓緟纭闂銆?

---

## 瀵硅瘽2: 鍚姩瀹℃煡

**鐢ㄦ埛**: 瀹℃煡

**AI**: 鍚姩闃舵1瀹℃煡Agent锛屽璁捐鏂囨。涓庡弬鑰冧唬鐮?beta2浠ｇ爜杩涜very thorough绾у埆瀹℃煡銆?

**缁撴灉**: 瀹℃煡鎶ュ憡淇濆瓨鑷?story/瀹℃煡鎶ュ憡.md锛屽彂鐜?0涓棶棰橈紙1楂?5涓?4浣庯級+ 8涓璁″亸绂?+ 17涓仐婕忋€傚叧閿棶棰橈細TimeCalendar鍥炶皟绛惧悕涓嶅噯纭€乤daptEvents鏃堕棿鏍煎紡涓嶇粺涓€銆侀仐婕廱eta2杩囨湡鏂囦欢娓呭崟绛夈€?

---

## 瀵硅瘽3: 鎵ц淇敼

**鐢ㄦ埛**: 淇敼

**AI**: 鍚姩闃舵2淇敼Agent锛屾寜瀹℃煡鎶ュ憡閫愭潯淇璁捐鏂囨。銆?

**缁撴灉**: 12/12鏉″叏閮ㄤ慨澶嶃€傝璁℃枃妗ｄ粠591琛屾洿鏂拌嚦635琛屻€備慨澶嶅唴瀹瑰寘鎷細鍥炶皟绛惧悕鏇存柊銆佹椂闂存牸寮忔爣娉ㄣ€佸弬鏁拌В鏋愯ˉ鍏呫€佸簾寮冩枃浠舵竻鍗曟墿灞曠瓑銆?

---

## 瀵硅瘽4: 鍚姩鐩橀棶浼氳瘽

**鐢ㄦ埛**: 涓轰簡鏄庣‘鏄惁浣犳竻妤氫簡鍏ㄩ儴闇€姹傦紝纭浣犵殑鏂规鏄惁鍏ㄩ儴鍚堢悊锛屼笅闈㈡寜杩欎釜鏂瑰紡杩涜鏄庣‘ D:\AI\skills\my skill\grill-with-docs\SKILL.md

**AI**: 鍔犺浇 Grill with Docs 鎶€鑳斤紝鍚姩鐩橀棶浼氳瘽銆傞」鐩腑鏃?CONTEXT.md 鍜?ADR锛屾儼鎬у垱寤恒€?

---

## 瀵硅瘽5: Q1 鈥?瑙ｈ€﹁竟鐣?

**AI鎻愰棶**: "瑙ｈ€?鐨勮竟鐣屽埌搴曞湪鍝潯绾匡紵鎺ㄨ崘锛氳В鑰﹁竟鐣?= src/timeline/ 鐨勭洰褰曡竟鐣岋紝timeline/ 鍐呮案杩滀笉 import mdye SDK銆?

**鐢ㄦ埛**: 鏄殑锛孴imeCalendar 缁勪欢鍙槸鎺ユ敹缁勮濂界殑鏁版嵁锛岃礋璐ｅ睍绀猴紝鎵€鏈夌殑浠庢槑閬撲簯鎺ユ敹鏁版嵁锛屽鐞嗘暟鎹紝鏁版嵁鍚堣鏍￠獙锛岄兘鏄湪TimeCalendar 缁勪欢涔嬪鍋氾紝鍥犳瑕佹牴鎹繖涓姹傦紝鍙婃槑閬撲簯鏁版嵁澶勭悊鐨勬柟寮忥紝鏄庣‘瑙ｈ€︾殑瀹氫箟锛屽湪鏂规涓婏紝瑕佹槑纭紝涓嶈兘鏈夊紓璁?

**鍐崇瓥**: 鍐欏叆 CONTEXT.md R1锛堣В鑰﹁竟鐣岋級

---

## 瀵硅瘽6: Q2 鈥?鏁版嵁鍚堣鏍￠獙鍒嗗伐

**AI鎻愰棶**: 涓夊鏍￠獙锛坙oaders/adapters/App.jsx锛夋槸鍚﹀簲鏈夋槑纭垎宸ワ紵鎺ㄨ崘锛歭oaders鈫掓暟鎹畬鏁存€ф牎楠岋紝adapters鈫掓牸寮忚浆鎹紝App.jsx鈫掑弬鏁伴粯璁ゅ€煎厹搴曘€?

**鐢ㄦ埛鍥炵瓟锛?涓鐐癸級**:
1. 涓嶇杈撳叆鍙傛暟鏈夊摢浜涳紝鍩烘湰瑙嗗浘鏋舵瀯瑕佹湁鏄剧ず锛屾椂闂磋酱瑕佹湁 begintime銆乪ndtime銆乼imeInterval銆佽楂樸€佸垪瀹界瓑锛屼絾娌℃湁涓氬姟鏁版嵁锛堣〃澶淬€佷簨浠剁瓑锛?
2. 琛ㄥご瑕佹湁鏈€鍩烘湰鏁版嵁锛堝憳宸?鎴块棿鍚嶏級锛屾棤鍒嗙粍榛樿"鏈垎缁?锛涗簨浠惰鏈夊紑濮嬫椂闂淬€佹椂闀挎垨缁撴潫鏃堕棿銆佸搴旀棩鏈熷拰琛ㄥご
3. adapters.js (adaptEvents) 涓嶆槑鐧芥槸浠€涔堬紝鏄椂鍖哄悧锛岃鏄庣‘

**AI鍥炲簲**: adapters 涓嶆槸鏃跺尯澶勭悊锛屾槸瀛楁閲嶅懡鍚?鏍煎紡杞崲鐨勭炕璇戝眰锛坅ccountId鈫抮esourceId, HH:mm鈫扝H:mm:ss, dur鈫抏ndTime璁＄畻, Map鈫扐rray, 鎵佸钩鈫掓爲褰㈠垎缁勶級銆?

**鍐崇瓥**: 鍐欏叆 CONTEXT.md R2锛堟渶浣庢覆鏌撹姹傦級銆丷3锛堟渶浣庝笟鍔℃暟鎹姹傦級

---

## 瀵硅瘽7: Q3 鈥?adapters 鏄惁淇濈暀

**AI鎻愰棶**: adapters.js 缈昏瘧灞傛槸鍚︽湁蹇呰鍗曠嫭瀛樺湪锛熸柟妗圓淇濈暀 vs 鏂规B鍚堝苟鍒發oaders銆傛帹鑽愭柟妗圓銆?

**鐢ㄦ埛**: A

**鍐崇瓥**: 鍐欏叆 CONTEXT.md R4锛坅dapters 鑱岃矗杈圭晫锛?

---

## 瀵硅瘽8: Q4 鈥?涓棿鏍煎紡涓?colIdx

**AI鎻愰棶**: loaders 杈撳嚭鐨勪腑闂存牸寮忛渶瑕佹寮忓畾涔夊悧锛焎olIdx 鏄棫鏋舵瀯閬楃暀鐗╋紝鍦ㄨВ鑰︽灦鏋勪笅鏃犳剰涔夛紝鏄惁绉婚櫎锛?

**鐢ㄦ埛**: 濂斤紝绉婚櫎

**鍐崇瓥**: 鍐欏叆 CONTEXT.md R5锛堜腑闂存牸寮忓绾︼級锛宑olIdx 姝ｅ紡绉婚櫎

---

## 瀵硅瘽9: Q5 鈥?eventAssembler.js

**AI鎻愰棶**: eventAssembler.js 鐨勫姛鑳藉凡琚?loaders+adapters+TimeCalendar 瑕嗙洊锛屾槸鍚﹂渶瑕侊紵鎺ㄨ崘涓嶉渶瑕併€?

**鐢ㄦ埛杩介棶**: 杩欐槸涓嶆槸闇€瑕佷慨鏀?timecalendar 缁勪欢涓唴瀹癸紝濡傛灉瀛樺湪 eventAssembler.js锛屼細鏈変粈涔堝奖鍝?

**AI鍥炲簲**: TimeCalendar 鍐呴儴涓?import eventAssembler.js锛坓rep 楠岃瘉锛夛紝绉婚櫎鎴栦繚鐣欓兘涓嶅奖鍝?TimeCalendar銆備繚鐣欑殑璇濆彧鏄笟鍔″眰澶氫竴涓彲閫夐澶勭悊姝ラ锛屼絾浼氶€犳垚"鏁版嵁鍦ㄥ摢灞傚鐞?鐨勬涔夈€?

**鐢ㄦ埛**: 淇濈暀锛屼絾瑕佽褰曪紝姝ょ粍浠?eventAssembler 涓嶄娇鐢?

**鍐崇瓥**: 鍐欏叆 CONTEXT.md R9锛堜繚鐣欎絾涓嶄娇鐢級

---

## 瀵硅瘽10: Q6 鈥?dragHandler 褰掑睘涓庡洖鍐欐祦绋?

**AI鎻愰棶**: dragHandler 鍋氬弽鍚戠炕璇戯紙TimeCalendar鍥炶皟鈫抦dye API鍐欏叆锛夛紝灞炰簬鍝竴灞傦紵鐢ㄦ埛甯屾湜涓氬姟灞傚喅瀹?onSave銆?

**鐢ㄦ埛杩介棶**: dragHandler 杩欐槸 TimeCalendar 缁勪欢鐨勫姛鑳斤紝杩樻槸 beta2 鐨勫姛鑳斤紵濡傛灉鏄?beta2 鐨勶紝涓嶄慨鏀?TimeCalendar锛屼綘鏉ュ畾銆?

**AI鍥炲簲**: grep 楠岃瘉 dragHandler 100% 鏄?beta2 涓氬姟灞備唬鐮侊紝TimeCalendar 鍐呴儴闆跺紩鐢ㄣ€?

**鍐冲畾**: 淇濇寔 dragHandler 缁撴瀯涓嶅彉锛孉pp.jsx 鍦ㄤ紶鍥炶皟缁?TimeCalendar 鍓嶅寘涓€灞備笟鍔″垽鏂€傛祦绋嬶細TimeCalendar鍥炶皟 鈫?App.jsx涓氬姟鍒ゆ柇 鈫?鍚屾剰鍒欒皟dragHandler 鈫?鍐欏叆mdye銆?

**鍐崇瓥**: 鍐欏叆 CONTEXT.md R6锛堜氦浜掑洖鍐欐祦绋嬶級

---

## 瀵硅瘽11: Q7 鈥?eventLayout.js 棰勮绠?

**AI鎻愰棶**: 浜嬩欢閲嶅彔甯冨眬鐢变笟鍔″眰棰勭畻锛堜紶 eventLayoutsMap锛夎繕鏄睍绀哄眰鑷繁绠楋紵鎺ㄨ崘鏂规A灞曠ず灞傝嚜宸辩畻銆?

**鐢ㄦ埛**: 閲嶅彔锛屾槸鐢卞睍绀哄眰澶勭悊锛屽凡鍋氬ソ鐨勬柟妗堬紝濡備綍閲嶅彔锛屽氨瀹藉害缂╄繘澶勭悊锛屽洜姝よ浼犲叆鍒板睍绀哄眰锛屼笟鍔″眰鍙寜鍓嶉潰瀹氱殑杩囨护鏁版嵁銆傚彟澶栵紝濡備綍鎴戞妸浠璇濋兘鑳借嚜鍔ㄧ殑璁板綍涓嬫潵銆?

**鍐崇瓥**: 鍐欏叆 CONTEXT.md R8锛堜簨浠堕噸鍙犲竷灞€鐢卞睍绀哄眰澶勭悊锛?

---

## 瀵硅瘽12: Q8 鈥?TimeCalendar 鍐呴儴缁勪欢锛圕onfigPanel/TestDataModal/鍐呴儴Toolbar锛?

**AI鎻愰棶**: TimeCalendar 鑷甫鐨?ConfigPanel銆乀estDataModal銆佸唴閮═oolbar 鏄紑鍙戣皟璇曞伐鍏凤紝鐢熶骇鐜鏄惁鏄剧ず锛熸帹鑽愪笉鏄剧ず銆?

**鐢ㄦ埛**: 涓嶆槸鐩橀棶璁板綍锛屾槸瀵硅瘽璁板綍锛屾槸鎵€鏈夌殑瀵硅瘽璁板綍锛屽苟涓旀瘡娆￠兘鑷姩鐨勮褰曪紝涓嶉渶瑕佸啀鎻愰啋銆傛椂闂磋酱鐨?begintime/endtime/slotHeight锛屽簲璇ヨ繕鏈変竴涓椂闂撮棿闅旓紝鍗充粠9:00鍒?3:00锛屾瘡15鍒嗛挓涓€鏍硷紝琛岄珮涓?0锛岃繖浜涘弬鏁版槸闇€瑕佺殑銆?

**鐘舵€?*: 鐢ㄦ埛纭鏃堕棿杞村弬鏁帮紙begintime/endtime/timeInterval/slotHeight锛夋槸蹇呴』鐨勩€俀8 鍏充簬 ConfigPanel/TestDataModal/鍐呴儴Toolbar 鍦ㄧ敓浜х幆澧冩槸鍚︽樉绀虹殑闂寰呯户缁‘璁ゃ€?

---

## 瀵硅瘽13: Q8 鈥?TimeCalendar 鍐呴儴璋冭瘯缁勪欢

**AI鎻愰棶**: ConfigPanel/TestDataModal/鍐呴儴Toolbar 鏄紑鍙戣皟璇曞伐鍏凤紝鐢熶骇鐜鏄惁鏄剧ず锛熸帹鑽愪笉鏄剧ず銆?

**鐢ㄦ埛**: 鍚屾剰

**鍐崇瓥**: 鈫?CONTEXT.md R8锛堣皟璇曠粍浠剁敓浜х幆澧冧笉鏄剧ず锛?

---

## 瀵硅瘽14: Q9 鈥?onEventDelete

**AI鎻愰棶**: dragHandler 宸插疄鐜?onEventDelete 浣?TimeCalendar 鏃犳鍥炶皟 prop锛屾槸鍚︽帴鍏ワ紵鎺ㄨ崘鏆備笉鎺ュ叆銆?

**鐢ㄦ埛**: 涓嶆帴鍏?

**鍐崇瓥**: 鈫?CONTEXT.md R10锛坥nEventDelete 涓嶆帴鍏ワ級

---

## 瀵硅瘽15: Q10 鈥?beta2 鏃х粍浠?鏃у姞杞藉櫒

**AI鎻愰棶**: BookingBar/ScheduleBar/bookingLoader/operateLoader/scheduleLoader 绛夋湭浣跨敤鐨?beta2 鏃ф枃浠舵槸鍚﹀叏閮ㄥ簾寮冿紵鎺ㄨ崘鍏ㄩ儴搴熷純銆?

**鐢ㄦ埛**: 鍚屾剰

**鍐崇瓥**: 鈫?CONTEXT.md R11锛堟棫缁勪欢鏃у姞杞藉櫒鍏ㄩ儴搴熷純锛?

---

## 瀵硅瘽16: Q11 鈥?COLOR_PALETTE/CP 缁熶竴

**AI鎻愰棶**: 12鑹插厹搴曡皟鑹叉澘鍦ㄤ笁澶勯噸澶嶅畾涔夛紝鏄惁缁熶竴鍒?constants.js锛?

**鐢ㄦ埛杩介棶**: COLOR_PALETTE 鏄仛浠€涔堢敤鐨勶紝棰滆壊鏄敱鐜鍙傛暟杈撳叆鐨勶紝濡傝儗鏅€佸瓧娈甸鑹茬瓑銆?

**AI鍥炲簲**: COLOR_PALETTE 涓嶆槸涓婚鑹叉潵婧愶紝鏄?CSS 鍙橀噺鍥為€€鍏滃簳銆傛槑閬撲簯涓嬫媺閫夐」鐨?color 鍙兘鏄?CSS 鍙橀噺锛堝 `var(--color-text-primary)`锛夛紝inline style 鏃犳硶娓叉煋锛宻afeColor() 妫€娴嬪埌 CSS 鍙橀噺鏃跺洖閫€鍒版璋冭壊鏉垮彇鏇夸唬棰滆壊銆?

**鐢ㄦ埛**: 鍚屾剰缁熶竴鍒?constants.js

**鍐崇瓥**: 鈫?CONTEXT.md R12锛圕OLOR_PALETTE 缁熶竴鍒?constants.js锛?

---

## 瀵硅瘽17: Q12 鈥?DebugPanel 鐢熶骇鐜

**AI鎻愰棶**: DebugPanel 鐢熶骇鐜鏄惁淇濈暀锛熸帹鑽愪繚鐣欙紝榛樿闅愯棌锛屽伐鍏锋爮淇濈暀璋冭瘯鎸夐挳銆?

**鐢ㄦ埛**: 鍚屾剰

**鍐崇瓥**: 鈫?CONTEXT.md R13锛圖ebugPanel 淇濈暀榛樿闅愯棌锛?

---

## 瀵硅瘽18: Q13 鈥?绉诲姩绔€傞厤

**AI鎻愰棶**: 绉诲姩绔€傞厤閫昏緫锛堝垪瀹?琛岄珮/鏃堕棿杞村闅忓睆骞曡皟鏁达級灞炰簬鍝竴灞傦紵

**鐢ㄦ埛杩介棶**: 杩欎釜绉诲姩绔€傞厤涓嶅簲璇ユ槸鏄剧ず灞傜殑鍔熻兘鍚楋紵鏄剧ず灞傛病鏈夎繖涓姛鑳斤紝涓嶅お鎳傦紝鏄庣‘涓€涓嬨€?

**AI鍥炲簲**: 鍒嗕袱閮ㄥ垎鈥斺€擜pp.jsx锛堜笟鍔″眰锛夌畻鍑哄昂瀵告暟鍊间紶鍏ワ紝TimeCalendar锛堝睍绀哄眰锛夋寜鏀跺埌鐨勬暟鍊兼覆鏌撱€俆imeCalendar 涓嶅唴缃搷搴斿紡閫昏緫锛屾槸绾彈鎺х粍浠躲€傜淮鎸佺幇鐘朵笉鏀?TimeCalendar銆?

**鐢ㄦ埛**: A锛堢淮鎸佺幇鐘讹級

**鍐崇瓥**: 鈫?CONTEXT.md R14锛堢Щ鍔ㄧ閫傞厤鐢变笟鍔″眰鍐冲畾灏哄锛?

---

## 鐩橀棶鎬荤粨

璁捐鏂囨。鍏ㄩ儴8涓緟纭椤?+ 瀹℃煡鎶ュ憡鐨勫叧閿棶棰樺潎宸插喅绛栵紝鍏变骇鍑?CONTEXT.md 15鏉¤鍒欙紙R1-R15锛夈€?

---

## 瀵硅瘽19: 鍏充簬"楠岃瘉"涓庡疄鏂芥柟寮?

**鐢ㄦ埛**: 楠岃瘉鏄仛浠€涔堝伐浣滐紝鎴戦渶瑕佸湪寮€鍙戞椂锛屼竴姝ヤ竴姝ョ殑鍋氾紝濡傜幆澧冨彉閲忥紝璇昏〃澶达紝璇讳簨浠讹紝璇昏儗鏅簨浠讹紝鍏蜂綋鍔熻兘锛岀瓑锛屽涓€涓缁嗙殑浠诲姟娓呭崟锛屾瘡娆″睍绀哄仛浜嗗摢浜涳紝楠岃瘉娌℃湁闂

**AI鍥炲簲**: 宸ヤ綔娴佺殑"楠岃瘉"鍙槸鏋勫缓妫€鏌ワ紝涓嶆槸鐢ㄦ埛闇€瑕佺殑銆傜敤鎴烽渶瑕佺殑鏄€愭寮€鍙戙€侀€愭楠岃瘉鐨勮缁嗗疄鏂芥竻鍗曘€傚熀浜庤璁℃枃妗ｅ拰 CONTEXT.md 鐨?5鏉¤鍒欙紝鎷嗗嚭4闃舵17姝ョ殑瀹炴柦娓呭崟锛屾瘡姝ラ兘鏈夋槑纭殑楠岃瘉鏍囧噯銆?

**缁撴灉**: 瀹炴柦娓呭崟淇濆瓨鑷?story/瀹炴柦娓呭崟.md锛屽寘鍚細
- P0 鍩虹璁炬柦锛圫tep 1-4锛夛細鐩綍缁撴瀯銆佸鍒禩imeCalendar銆佸伐鍏峰嚱鏁般€佺┖鏁版嵁楠ㄦ灦
- P1 鏁版嵁灞傦紙Step 5-9锛夛細env鍙傛暟璇诲彇銆侀摼1琛ㄥご銆侀摼3涓讳簨浠躲€侀摼2闄勫睘浜嬩欢銆佷笁閾惧悎骞?
- P2 浜や簰灞傦紙Step 10-12锛夛細鐐瑰嚮璇︽儏銆佹嫋鎷界Щ鍔ㄣ€佹媺浼?妗嗛€夋柊寤?
- P3 杈呭姪鍔熻兘锛圫tep 13-15锛夛細宸ュ叿鏍忋€佽皟璇曢潰鏉?鑷姩鍒锋柊銆佺Щ鍔ㄧ閫傞厤
- P4 鏀跺熬锛圫tep 16-17锛夛細鍏ㄥ眬妫€鏌ャ€佸姛鑳藉洖褰掓祴璇?

---

## 瀵硅瘽20: 寮€濮嬪疄鏂?Step 1

**鐢ㄦ埛**: 濂斤紙纭浠?Step 1 寮€濮嬶級

**AI鎵ц**: 鍒涘缓鐩綍缁撴瀯锛?
- `src/timeline/hooks/` 鉁?
- `src/hooks/` 鉁?
- `src/loaders/` 鉁?
- `src/components/` 鉁?
- `src/utils/` 鉁?

**楠岃瘉缁撴灉**:
```
src/
  App.js           鈫?鍘熸湁
  components/      鉁?鏂板缓
  hooks/           鉁?鏂板缓
  icon.svg         鈫?鍘熸湁
  index.js         鈫?鍘熸湁
  loaders/         鉁?鏂板缓
  style.less       鈫?鍘熸湁
  timeline/        鉁?鏂板缓
    hooks/         鉁?鏂板缓
  utils/           鉁?鏂板缓
```

**鐘舵€?*: Step 1 瀹屾垚锛屽緟鐢ㄦ埛纭

---

## 瀵硅瘽21: Step 2 鈥?澶嶅埗 TimeCalendar 灞曠ず灞?

**鐢ㄦ埛**: 濂斤紙纭 Step 1锛岀户缁?Step 2锛?

**AI鎵ц**:
- 澶嶅埗 `鍙傝€?timecalendar/timeline/` 鈫?`src/timeline/`锛?涓枃浠?+ hooks/useDrag.js锛?
- 澶嶅埗 `鍙傝€?timecalendar/utils/` 鈫?`src/utils/`锛坋ventAssembler.js銆乪ventLayout.js銆乼estData.js锛?

**楠岃瘉缁撴灉**:
- src/timeline/: 10涓潯鐩紙9鏂囦欢+1鐩綍锛?鉁?
- src/timeline/hooks/useDrag.js 鉁?
- src/utils/: 3涓枃浠?鉁?
- R1妫€鏌? grep `import.*mdye` in src/timeline/ 鈫?0鍖归厤 鉁?

**鐘舵€?*: Step 2 瀹屾垚

---

## 瀵硅瘽22: Step 3 鈥?鎼缓宸ュ叿鍑芥暟锛堝幓閲嶇粺涓€锛?

**鐢ㄦ埛**: 缁х画

**AI鎵ц**:
- 浠?beta2 澶嶅埗 `constants.js`锛堝惈 COLOR_PALETTE锛?90琛岋級
- 浠?beta2 澶嶅埗 `parseParam.js`锛?涓鍑猴細parseParam/resolveWorksheet/getRelationOpenView/getViews/paramText锛?
- 浠?beta2 澶嶅埗 `mdyeApi.js`锛?涓鍑猴細getControls/getFilteredRows/buildDateFilter锛?
- 鏂板啓 `parseField.js`锛圧12: CP 鏀逛负 `import { COLOR_PALETTE as CP } from "./constants"`锛?涓鍑猴級

**楠岃瘉缁撴灉**:
- src/utils/ 鍏?涓枃浠讹紙4涓伐鍏峰嚱鏁?+ 3涓猄tep2鐨勬枃浠讹級 鉁?
- parseField.js 绗?琛? `import { COLOR_PALETTE as CP } from "./constants"` 鉁?(R12)
- grep `helpers` in src/ 鈫?0鍖归厤 鉁咃紙鏃?helpers.js 娈嬬暀寮曠敤锛?

**鐘舵€?*: Step 3 瀹屾垚

---

## 瀵硅瘽23: Step 4 鈥?鏈€灏忓彲杩愯楠ㄦ灦

**鐢ㄦ埛**: 濂斤紙纭 Step 3锛岀户缁?Step 4锛?

**AI鎵ц**:
- 鍒涘缓 `src/App.jsx`锛氬鍏?TimeCalendar + constants锛屼紶鍏ョ┖鏁版嵁 + 榛樿鏃堕棿杞村弬鏁?
- 鍒犻櫎鏃х増 `src/App.js`锛坢dye 妯℃澘鏂囦欢锛?
- 鏇存柊 `src/index.js`锛歚import App from "./App.jsx"`

**App.jsx 閰嶇疆**:
- begintime="08:00", endtime="23:00", timejiange=15, slotHeight=30锛圧2锛?
- colWidth=72, axisWidth=80
- resources=[], events=[], departmentTree=[]锛堢┖鏁版嵁锛?

**寰呯敤鎴烽獙璇?*: 杩愯 `mdye dev`锛岄〉闈㈠簲鏄剧ず绌虹殑鏃堕棿杞撮鏋讹紙08:00-23:00锛屾瘡15鍒嗛挓涓€鏍硷紝鏈夌綉鏍肩嚎锛屾棤琛ㄥご锛屾棤浜嬩欢锛?

**鐘舵€?*: Step 4 浠ｇ爜瀹屾垚锛屽緟杩愯楠岃瘉

---

## 瀵硅瘽24: Step 5 鈥?env 鍙傛暟璇诲彇涓庤В鏋?

**鐢ㄦ埛**: 缁х画

**AI鎵ц**: 鏇存柊 App.jsx锛屾坊鍔?env 鍙傛暟璇诲彇锛?
- 瀵煎叆 `env` from `mdye`
- 鏃堕棿杞村弬鏁帮細beginTime/endTime/timeInterval + 榛樿鍊煎厹搴?
- showstyle 褰掍竴鍖栵細涓嬫媺鍊?`["key"]` 鈫?鍒ゆ柇鍚?鍖洪棿" 鈫?timeFormat='range'/'single'
- 鍝嶅簲寮忥細forceMobile + window.resize 鈫?colWidth(72/56) + axisWidth(80/60)
- UI鍙傛暟锛歳owHeader/columnHeader + 榛樿鍊?
- console.log 杈撳嚭瑙ｆ瀽缁撴灉鍜?env 鍘熷鍊?

**App.jsx 鍙傛暟鏄犲皠**:
| env 鍙傛暟 | 瑙ｆ瀽鍚庡彉閲?| 榛樿鍊?| 浼犵粰 TimeCalendar |
|----------|-----------|--------|-------------------|
| beginTime | begintime | "08:00" | begintime |
| endTime | endtime | "23:00" | endtime |
| timeInterval | timejiange | 15 | timejiange |
| showstyle | timeFormat | "single" | timeFormat |
| rowHeader | rowHeader | "浜哄憳" | rowHeader |
| columnHeader | columnHeader | "鏃堕棿" | columnHeader |
| forceMobile | isMobile | false | 鈫?colWidth/axisWidth |

**楠岃瘉**: `mdye dev` 鍚姩锛屾祻瑙堝櫒鎺у埗鍙板簲鏄剧ず銆愮幆澧冨弬鏁般€戝拰銆恊nv 鍘熷鍊笺€戞棩蹇楋紝鏃堕棿杞村弬鏁板簲涓庢槑閬撲簯鎻掍欢閰嶇疆涓€鑷?

**鐘舵€?*: Step 5 瀹屾垚

---

## 瀵硅瘽25: Step 5.5 鈥?瀹屾暣涓氬姟宸ュ叿鏍?

**鐢ㄦ埛**: 娌℃湁宸ュ叿鏍忥紝宸ュ叿鏍忔槸鍝釜妯″潡璐熻矗鐨勶紵鏂规A锛堜笟鍔″眰锛夎繕鏄泦鎴愬埌TimeCalendar锛熷厛鎶婂畬鏁寸殑宸ュ叿鏍忓仛濂姐€?

**AI**: 鏂规A锛堜笟鍔″眰 `src/components/Toolbar.jsx`锛夛紝鐞嗙敱锛氬伐鍏锋爮鍐呭鏄笟鍔℃蹇碉紝涓嶄慨鏀筎imeCalendar锛圧1锛夈€?

**AI鎵ц**:
- 浠?beta2 澶嶅埗 `components/Toolbar.jsx`锛?74琛岋紝鍚闈㈢+绉诲姩绔竷灞€锛?
- 鏇存柊 App.jsx锛氭坊鍔?currentDate/showDebug/refreshKey 鐘舵€侊紝闆嗘垚 Toolbar

**Toolbar 鍔熻兘娓呭崟**:
- 鏃ユ湡瀵艰埅锛? 鍓嶄竴澶?| 鏃ユ湡閫夋嫨鍣?| 鍚庝竴澶?> | 浠婂ぉ
- 鍒锋柊鎸夐挳 馃攧
- 璁℃暟鏄剧ず锛氫汉鍛?N | 涓讳簨浠?N锛堝綋鍓嶄紶0锛孲tep 6+杩炴帴鐪熷疄鏁版嵁锛?
- 璋冭瘯寮€鍏筹細鏄剧ず/闅愯棌鏃ュ織
- 绉诲姩绔簿绠€甯冨眬锛圧14锛?

**楠岃瘉**: Toolbar 鏃?mdye 渚濊禆 鉁咃紝鏃ユ湡瀵艰埅鍔熻兘鍙敤锛岀偣鍑诲墠涓€澶?鍚庝竴澶?浠婂ぉ鍙垏鎹㈡棩鏈?

**鍐崇瓥**: 鈫?CONTEXT.md R14 琛ュ厖纭锛堝伐鍏锋爮灞炰簬涓氬姟灞傦級

---

## 瀵硅瘽26: Step 6 鈥?閾? 琛ㄥご鍔犺浇

**鐢ㄦ埛**: 濂斤紙纭 Step 5.5锛?

**AI鎵ц**: 鍒涘缓3涓枃浠?+ 鏇存柊 App.jsx锛?
- `src/loaders/headerLoader.js` 鈫?beta2 杩佺Щ锛堥摼1锛氳В鏋?headerDisplayField 鈫?resolveWorksheet 鈫?getControls 鈫?getFilteredRows 鈫?parseField 鈫?staffMap锛?
- `src/utils/adapters.js` 鈫?鏂板缓锛圧4锛歛daptResources + adaptEvents + buildDepartmentTree + adaptTableViewData锛?
- `src/hooks/useDataLoader.js` 鈫?鏂板缓鏈€灏忕増锛堜粎閾?锛岃В鏋?header 鍙傛暟 鈫?loadHeaderStaff 鈫?杩斿洖 staffMap锛?
- `src/App.jsx` 鈫?鏇存柊锛堥泦鎴?useDataLoader + adaptTableViewData 鈫?鐪熷疄鏁版嵁浼犲叆 TimeCalendar + Toolbar 璁℃暟锛?

**鏁版嵁娴?*:
```
env.headerDisplayField 鈫?parseParam 鈫?resolveWorksheet 鈫?getFilteredRows
  鈫?parseField 鈫?staffMap (R5涓棿鏍煎紡)
  鈫?adaptResources 鈫?resources[] (鏍囧噯鏍煎紡)
  鈫?buildDepartmentTree 鈫?departmentTree[]
  鈫?TimeCalendar 娓叉煋琛ㄥご鍒?
```

**楠岃瘉**: import 璺緞鍏ㄩ儴姝ｇ‘ 鉁咃紝headerLoader鈫?./utils/* 鉁咃紝useDataLoader鈫?./loaders/* 鉁?

**寰呯敤鎴烽獙璇?*: mdye dev 鈫?椤甸潰搴旀樉绀鸿〃澶村垪锛堜汉鍛?鎴块棿鍚嶇О锛夛紝鎸夐儴闂ㄥ垎缁勬帓鍒楋紝Toolbar 鏄剧ず姝ｇ‘鐨勪汉鍛樿鏁?

---

## 瀵硅瘽27: Step 7 鈥?閾? 涓讳簨浠跺姞杞?

**鐢ㄦ埛**: 纭锛圫tep 6锛?

**AI鎵ц**:
- 鍒涘缓 `src/loaders/mainEventLoader.js` 鈫?beta2 杩佺Щ锛?*宸茬Щ闄?colIdx锛圧5锛?*
- 鏇存柊 `src/hooks/useDataLoader.js` 鈫?娣诲姞閾?锛氳В鏋?涓富浜嬩欢鍙傛暟 鈫?loadMainEvents 鈫?mainStaffMap 鍚堝苟

**R5 楠岃瘉**: grep colIdx in mainEventLoader.js 鈫?0鍖归厤 鉁?
**Import 璺緞**: mdye 鉁? ../utils/parseField 鉁? ../utils/mdyeApi 鉁?

**鏁版嵁娴?*:
```
env.mainEventDateField 鈫?parseParam 鈫?buildDateFilter 鈫?getFilteredRows
  鈫?extractTime + parseField 鈫?events (R5涓棿鏍煎紡锛屾棤colIdx)
  鈫?adaptEvents 鈫?TimeCalendar events (鏍囧噯鏍煎紡锛宺esourceId鍖归厤)
```

**寰呯敤鎴烽獙璇?*: mdye dev 鈫?涓讳簨浠舵潯搴斿嚭鐜板湪瀵瑰簲浜哄憳/鎴块棿鍒楃殑姝ｇ‘鏃堕棿浣嶇疆锛岄鑹蹭笌鏄庨亾浜戜笅鎷夐€夐」涓€鑷?

---

## 瀵硅瘽28-30: Step 7 楠岃瘉 鈥?浜嬩欢鏄剧ず闂鎺掓煡涓庝慨澶?

**闂1**: 浜嬩欢 title 鏄剧ず "浜憌ftc45" 涓嶆纭?
- 娣诲姞璇婃柇鏃ュ織鎺掓煡 鈫?鐢ㄦ埛鍙戠幇鏄嚜宸遍厤缃簡涓や釜鍚屽悕瀛楁锛岄厤缃慨姝ｅ悗 title 姝ｇ‘

**闂2**: 棰滆壊鍊?"#1677ffff" 8浣峢ex
- 淇 `parseField.js` 鐨?`safeColor()`锛氬鍔?8浣峢ex 鎴柇涓?7浣?鉁?

**闂3**: 浜嬩欢鏉″瓧浣撻鑹蹭笉姝ｇ‘
- 鏍瑰洜锛歍imeCalendar 鐨?EventBar 鏂囧瓧棰滆壊纭紪鐮佺櫧鑹诧紝鏃犺嚜瀹氫箟瀛椾綋棰滆壊杈撳叆
- 淇锛?
  - `EventBar.jsx` 绗?55琛岋細span 娣诲姞 `color: ev.fontColor || '#fff'`锛堝睍绀哄眰鍞竴淇敼锛?
  - `adapters.js`锛氭坊鍔?`fontColor: ev.fc || "#fff"` 鏄犲皠
- 鍒涘缓 `src/timeline/淇敼璁板綍.md` 璁板綍灞曠ず灞備慨鏀?
- 鏂囦欢瀵规瘮楠岃瘉锛氬睍绀哄眰浠?EventBar.jsx 涓€澶?DIFF锛屽叾浣?涓枃浠?MD5 涓€鑷?鉁?

---

## 瀵硅瘽31-34: 棰滆壊闂娣卞害鎺掓煡

**鐢ㄦ埛鍙嶉**: #757575/#515151 鏄剧ず钃濊壊锛?ffffff 鏄剧ず绾㈣壊

**鏍瑰洜纭**: 
- bgField options: 4 涓€夐」锛屽叾涓?1 涓?CSS 鍙橀噺 `var(--color-text-primary)`
- fontField options: 7 涓€夐」锛屽叾涓?3 涓?CSS 鍙橀噺锛?/3/4锛夈€? 涓?8浣峢ex锛?/6锛夈€? 涓甯竓ex锛?/5锛?
- parseParam 瑙ｆ瀽姝ｇ‘锛屽弬鏁颁紶閫掓纭?
- 杩欐槸鏄庨亾浜戝钩鍙伴檺鍒讹紝涓嶆槸浠ｇ爜闂
- 瑕佸畬鍏ㄥ尮閰嶉厤鑹查』鍦ㄦ槑閬撲簯鍚庡彴鏀圭敤鑷畾涔?hex



---

## 瀵硅瘽35-48: 鐐瑰嚮鎵撳紑璇︽儏 鈥?闀挎椂闂存帓閿?

**闂**: 鐐瑰嚮浜嬩欢鏉℃棤娉曟墦寮€鏄庨亾浜戣鎯咃紝鍚勭灏濊瘯鍧囧け璐?

**鎺掓煡杩囩▼**:
- Step10-12: 闆嗘垚 dragHandler銆亀ire up onEventClick 鈫?涓嶅伐浣?
- App.jsx 婕忚В鏋?`controlsRef` 鈫?淇 鈫?浠嶄笉宸ヤ綔
- EventBar 鐨?onClick 渚濊禆 mouseDownPos锛屼絾 useDragMove.handleMouseDown 鐨?e.preventDefault() 闃绘娴忚鍣ㄧ敓鎴?click 浜嬩欢锛圚TML 瑙勮寖锛?
- 绉婚櫎 useDrag.js 3澶?preventDefault 鈫?浠嶄笉宸ヤ綔
- 鏀逛负 onMouseUp 妫€娴嬬偣鍑?鈫?MOUSEUP-click 鍙互鎵撳嵃浣嗕笉瑙﹀彂鍥炶皟
- 鍘熺敓 DOM click 鐩戝惉銆丷eact onMouseUp 鍏ㄩ儴鏃犳硶瑙﹀彂
- Test Button 鐩存帴璋冪敤 utils.openRecordInfo 鈫?鍙互鎵撳紑璇︽儏 鉁?鈫?璇佹槑闂涓嶅湪 mdye SDK
- 鍙戠幇 RAF state 鏇存柊浼氭浛鎹?DOM 褰卞搷 click 鐢熸垚
- 鍚勭灏濊瘯鍚庢渶缁堟€€鐤戯細鎷栨嫿 div 瑕嗙洊鏁翠釜 Bar锛寊Index 鏇撮珮锛屾嫤鎴墍鏈変簨浠?

**鐢ㄦ埛**: 鍙傝€?qoder 鍐欑殑鎶ュ憡 D:\AI\椤圭洰婧愮爜\鏄庨亾浜戞彃浠跺紑鍙慭time瑙嗗浘\docs\鐐瑰嚮浜嬩欢闂妫€鏌ユ姤鍛?md

**AI 璇诲彇**: qoder 鎶ュ憡纭鏍瑰洜鈥斺€攗seDragMove 鐨?e.preventDefault() 闃绘 click銆傛帹鑽愭柟妗圓锛歰nMouseUp + isDraggingRef

**鐢ㄦ埛**: 杩樻槸涓嶈锛屽弬鑰?beta1 D:\AI\椤圭洰婧愮爜\鏄庨亾浜戞彃浠跺紑鍙慭棰勭害鐪嬫澘\姝ｅ紡鐗坆eta1

**AI 鍒嗘瀽**: beta1 涓嶇敤鐙珛鐨?TimeCalendar 缁勪欢锛岀敤鏈湴 EventBar + 鐙珛 drag 妯″潡銆俠eta1 EventBar 鐨?drag 鎵嬫焺涓嶈鐩?Bar锛屾枃瀛楀湪椤跺眰鏈?`pointerEvents: none`

---

## 瀵硅瘽49: 鏂规A 鈥?zIndex 璋冩暣锛堟渶缁堜慨澶嶏級

**AI 鍒嗘瀽**: 鏂扮増 EventBar 鐨勬嫋鎷?div `zIndex:3` 楂樹簬鏂囧瓧 span `zIndex:2`锛岃鐩栨暣涓?Bar 瀵艰嚧鎵€鏈変簨浠惰鎷︽埅

**鐢ㄦ埛**: 鏂规A濡備綍淇敼锛屾敼鍝簺鍐呭锛屽奖鍝嶏紝椋庨櫓

**AI 鍥炲**: 浠呮敼 2 琛?zIndex锛?
- drag div: 3鈫?
- span: 2鈫?
- 鍘熺悊锛氭枃瀛楃┛閫?pointerEvents:none) 鈫?鎷栨嫿 div 澶勭悊 mousedown 鈫?click 鍐掓场鍒?Bar

**鐢ㄦ埛**: 濂斤紝鍋氬ソ澶囦唤锛屼慨鏀癸紝娴嬭瘯

**AI 鎵ц**:
- 澶囦唤 EventBar.jsx.bak-20260530-v3
- L148: drag div zIndex 3鈫?
- L162: span zIndex 2鈫?
- 鏇存柊淇敼璁板綍锛堜慨鏀?锛?

**鐢ㄦ埛**: 瀵硅瘽璁板綍娌℃湁璁板綍锛屽浣曡浣犱竴鐩磋浣?

**AI 琛ュ叏**: 杩藉姞瀵硅瘽35-49鍒版璁板綍

---

## 瀵硅瘽50-55: 鐐瑰嚮闂娣卞叆鎺掗敊 鈥?澶氱鏂规灏濊瘯

**闂**: zIndex 淇敼鍚庣偣鍑讳粛涓嶅伐浣?

**鎺掓煡**:
- 鎬€鐤?onClick props 鏈紶閫?鈫?EventBar-props 璇婃柇鏄剧ず onClick:function 鉁?
- 鎬€鐤戦棴鍖呴棶棰?鈫?鐢?onClickRef 缁曞紑 鈫?浠?undefined
- 鏀圭敤 window.__openRecord 鍏ㄥ眬鍑芥暟 鈫?鐐瑰嚮鍙墦寮€ 鉁?
- 浣嗘嫋鎷戒篃瑙﹀彂鎵撳紑 鈫?闇€鍖哄垎鐐瑰嚮/鎷栨嫿
- 鐢?mouseDownPos 妫€鏌ョЩ鍔?鈫?浣?mouseDownPos 濮嬬粓 (0,0)
- 鏀圭敤 dragMovedRef锛堟枃妗?mousemove 鐩戝惉锛夆啋 鐐瑰嚮宸ヤ綔 + 鎷栨嫿涓嶈瑙?鉁?
- 鏀逛负 onMouseUp 鏇夸唬 onClick 鈫?缂栬瘧鎶ラ敊锛堢己 useEffect import锛?
- 绉婚櫎 useDragMove 鐨?stopPropagation + RAF 寤惰繜 state 鈫?鐐瑰嚮鏈€缁堝彲浠ュ伐浣?鉁?

**鍐崇瓥**: EventBar 浣跨敤 dragMovedRef + 5px 闃堝€?+ onMouseUp + 鍏ㄥ眬鍑芥暟鍏滃簳

---

## 瀵硅瘽56-58: 鎷栨嫿/鎷変几鍐欏叆闂

**闂**: mdye 0.1.x API 璺緞鍙樺寲
- 鏃? `apis.worksheet.editWorksheetRows` 鈫?鏂? `api.updateWorksheetRow`
- 閲嶅啓 dragHandler.js 閫傞厤鏂?API锛坣ewOldControl/receiveControls 鏍煎紡锛?

**闂**: 涔愯鏇存柊寮曞叆鐨?bug 鈥?鍏堟敼 ev.accountId 鍐嶅垽鏂?鈫?姘歌繙 false
- 宸茬敤 oldAccountId 淇濆瓨鏃у€间慨澶?
- 璁板叆閾佸緥 7: 鍏堣鍚庡啓

**闂**: onEventResize 婕忎簡 `var controls = []` 鈫?ReferenceError
- 宸茶ˉ鍥?

**闂**: 鍏宠仈璁板綍鍐欏叆鏍煎紡 `[{sid: uuid}]` 鈫?鍙傝€?devtest/SKILL_RELATION.md
- 宸插疄鐜?buildFieldValue 涓囪兘鍐欏叆鍑芥暟
- 宸插啓鍏?Skill 鏂囨。 `story/SKILL-瀛楁瑙ｆ瀽涓庡啓鍏?md`

**闂**: 鎷栨嫿鏉炬墜寮瑰洖鍘熶綅 鈫?useDragMove 涓嶇珛鍗虫竻鐞?isDragging

---

## 瀵硅瘽59-60: 鍒椾綋琛ㄥご閿欎綅 BUG

**鐜拌薄**: 鏈寸編鍠勭殑涓讳簨浠舵樉绀哄湪闄堣寽鍒椾笅

**鎺掓煡杩囩▼**:
- 鏌ヨ〃澶存暟鎹?鈫?staffMap 26浜猴紝鍖呭惈鏈寸編鍠勫拰闄堣寽 鉁?
- 鏌ュ尮閰嶉€昏緫 鈫?mainEventLoader 鍖归厤 accountId 姝ｇ‘ 鉁?
- 鏌?adapted 鏁版嵁 鈫?resource.id 鍜?event.resourceId 涓€鑷?鉁?
- 鏌?TimeCalendar 鍐呴儴鍖归厤 鈫?TIMELINE-COL 璇婃柇璇佹槑鍖归厤姝ｇ‘ 鉁?
- **鏈€缁堝彂鐜?*: buildDepartmentTree 鎸?departmentId(UUID)鎺掑簭锛宧eaderLoader 鎸?departmentName(pinyin)鎺掑簭 鈫?琛ㄥご鍜屽垪浣撻敊浣?

**淇**: adapters.js 1 琛?`departmentId` 鈫?`departmentName`

**鏁欒**: 
- 琛ㄥご鍜屽垪浣撳繀椤诲悓婧愭帓搴?
- "鏁版嵁姝ｇ‘" != "鏄剧ず姝ｇ‘"锛岀4娆¤瘖鏂凡璇佸疄鍖归厤鏃犺鏃跺簲杞煡娓叉煋
- 鎺掑簭鏄殣寮忓绾︼紝涓ゆā鍧楀悇鑷帓蹇呴』閿竴鑷?

**璁板綍**: `story/BUG-001-鍒椾綋琛ㄥご閿欎綅.md`

---

## 瀵硅瘽61: 缂栬緫瀹夊叏瑙勫垯鏇存柊

- 閾佸緥 6: Hook 浣跨敤蹇呮鏌?import锛坲seEffect 婕?import 瀵艰嚧缂栬瘧閿欒锛?
- 閾佸緥 7: 鍏堣鍚庡啓锛岀姝㈠湪鍒ゆ柇鏉′欢鍓嶄慨鏀瑰彉閲?
- 閾佸緥 8: TimeCalendar 灞曠ず灞備慨鏀硅鍒欙紙澶囦唤+娉ㄩ噴+璁板綍+楠岃瘉锛?

---

## 瀵硅瘽62-63: buildFieldValue Skill

- 涓囪兘鍐欏叆鍊肩粍瑁呭嚱鏁帮紝瑕嗙洊 type 29/26/27/9/10/11/绛?
- 淇濆瓨鑷?`story/SKILL-瀛楁瑙ｆ瀽涓庡啓鍏?md`
- dragHandler 宸插叏闈娇鐢?

---

## 瀵硅瘽64: 杩涘害鏁寸悊

- 鍒涘缓 `story/杩涘害鐘舵€?md` 璁板綍鎵€鏈変换鍔¤繘搴?
- 鏇存柊 `story/瀹炴柦娓呭崟.md` 杩涘害琛ㄦ牸寮忎负"闃舵|浠诲姟|鏃堕棿|杩涘害|鐘舵€亅渚濊禆"
- useAutoRefresh 瀹炵幇 鉁咃紝闃诲瑙ｉ櫎锛孲tep 11/11b/12 鍙疄娴?

---

## 鏂偣鎽樿 (2026-05-30 浼氳瘽缁撴潫)

**宸插畬鎴?*: useAutoRefresh 鉁? useBoxSelect(妗嗛€? 鉁? 榛樿鍊煎～鍏?鉁? multi-select鍚堝苟淇 鉁? Skill鏂囨。 鉁?

**寰呴獙璇?*: 鎷栨嫿 / 鎷変几 / 妗嗛€?/ 鑷姩鍒锋柊 瀹炴祴

**寰呭畬鎴?*: EventBar 浠ｇ爜娓呯悊, mdye build, 鍥炲綊娴嬭瘯

**鍏抽敭鏂囦欢**: 
- `story/SKILL-鎻掍欢瑙嗗浘寮€鍙?md` 鈥?瀹炴垬 Skill 鍚堥泦
- `story/杩涘害鐘舵€?md` 鈥?瀹屾暣杩涘害
- `story/瀹炴柦娓呭崟.md` 鈥?17 姝ヤ换鍔¤〃
- `story/缂栬緫瀹夊叏瑙勫垯.md` 鈥?8 鏉￠搧寰?

---

## 鏂偣鎽樿 (2026-05-30 浼氳瘽缁撴潫)

**Git**: 宸插垵濮嬪寲浠撳簱锛屼富鍒嗘敮 `master`锛屽紑鍙戝垎鏀?`dev`锛岄噷绋嬬 `v1.0.0-milestone`
**鍚姩**: `git checkout dev` 鈫?缁х画寮€鍙?

**宸插畬鎴?*: 
- 绯荤粺鏋舵瀯锛?灞傝В鑰︺€?4妯″潡銆丷1-R17瑙勫垯
- 鏁版嵁灞傦細涓夐摼鍔犺浇(header/sub/main) + useAutoRefresh
- 宸ュ叿灞傦細parseField.js(12鍑芥暟) + parseParam.js(5鍑芥暟) + mdyeApi.js(3鍑芥暟)
- 浜や簰灞傦細鐐瑰嚮璇︽儏 + 鎷栨嫿绉诲姩 + 鎷変几璋冩暣 + 妗嗛€夋柊寤?useBoxSelect.js)
- 榛樿鍊硷細getDefaultValue绫诲瀷鎰熺煡 + buildFieldValue 10绉峵ype
- 灞曠ず灞傦細EventBar(5澶勪慨鏀? + useDrag(5澶勪慨鏀? + useBoxSelect(120琛?

**寰呭畬鎴?*: 浠ｇ爜娓呯悊, mdye build, 鍥炲綊娴嬭瘯

**鍏抽敭鏂囦欢**: story/杩涘害鐘舵€?md, story/SKILL-鎻掍欢瑙嗗浘寮€鍙?md, story/璁捐鏂囨。.md

---

## 瀵硅瘽65-67: 浠ｇ爜娓呯悊涓庣紪璇戞鏌?

**鐢ㄦ埛瑕佹眰**: 鍙彲璁″垝銆佷笉鍙洿鎺ユ墽琛屼唬鐮佷慨鏀?

**16b 棰勬**: 鍒嗘瀽 EventBar.jsx 鍙戠幇 useCallback(瀵煎叆鏈娇鐢?銆乷nClickRef(澹版槑+璧嬪€兼湭浣跨敤)銆乵ouseDownPos/handleMouseDown(dragMovedRef 妫€娴嬩緷璧栵紝闇€淇濈暀)銆傞妗? 2 澶勫垹闄わ紝-3 琛屻€傜敤鎴疯姹傛敞閲婁笉鍒犻櫎銆?

**浜嬫晠**: `import React, { useRef, /* useCallback */, useEffect }` 鈥?Babel 涓嶆敮鎸?import 瑙ｆ瀯鍐呮敞閲婏紝缂栬瘧澶辫触銆備慨澶? 琛屾敞閲婃斁 import 涔嬪墠锛岀洿鎺ョЩ闄?useCallback銆?

**R18 瑙勫垯**: 璁板叆 CONTEXT.md 鈥?绂佹鍦?import/export 鎷彿鍐呮敞閲娿€?

**娓呯悊缁撴灉**: EventBar.jsx L1 绉婚櫎 useCallback锛孡72-74 onClickRef 澹版槑+璧嬪€兼敞閲婁繚鐣欍€?

## 瀵硅瘽68: 浠诲姟鐘舵€佹洿鏂?

16c 闈炰换鍔★紝17a/b/c/d 宸插疄娴嬮€氳繃銆備粎鍓?16b 瀹屾垚 + 17e 鍥炲綊娴嬭瘯寰呭仛銆?

## 瀵硅瘽69: Git 閲岀▼纰?

鍒濆鍖?Git 浠撳簱锛屾彁浜ゆ墍鏈変唬鐮?(`v1.0.0 閲岀▼纰慲)锛屾墦 tag `v1.0.0-milestone`锛屽缓寮€鍙戝垎鏀?`dev`銆傚洖閫€: `git checkout v1.0.0-milestone`銆?

## 瀵硅瘽70: 绉诲姩绔?slotHeight

App.jsx 琛ュ厖 isMobile 鑷€傚簲 slotHeight (formula: `Math.max(24, (window.innerHeight*0.6)/numSlots)`)锛屾闈㈢鍥哄畾 30銆傛祴璇? F12 DevTools 鎴?forceMobile="true"銆?

## 瀵硅瘽71-72: 浜嬩欢閲嶅彔淇

**鏍瑰洜**: R1 寤虹珛鍚?Step2 鐢?`Copy-Item dir/*` 涓€鎶婂鍒讹紝灏嗙函灞曠ず灞傛枃浠?`eventLayout.js` 璇斁鍏ヤ笟鍔″眰 `src/utils/`锛孴imeCalendar 鏈皟鐢紝閲嶅彔鍔熻兘澶辨晥銆?

**淇**: eventLayout.js 绉诲姩鑷?`src/timeline/hooks/`锛孴imeCalendar 鍐?import + 璋冪敤 `calculateEventLayout(staffEvents)`锛屾浛鎹㈠閮?prop `eventLayoutsMap`銆侫pp.jsx 闆舵敼鍔ㄣ€?

**R19 瑙勫垯**: 绂佹涓€鎶婂鍒讹紝閫愭枃浠?grep mdye 纭褰掑睘銆?

## 瀵硅瘽73: 浠婃棩鎬荤粨

**宸插畬鎴愭柊澧炲姛鑳?*: useBoxSelect(妗嗛€?20琛?銆乽seAutoRefresh(24琛?銆乥uildFieldValue 琛ラ綈銆乬etDefaultValue 閲嶅啓绫诲瀷鎰熺煡銆乪xtractRowid 浠?dragHandler 杩佸叆 parseField銆乂AR_COLOR_MAP 8鏄犲皠銆佺Щ鍔ㄧ slotHeight銆乪ventLayout 灞曠ず灞傚唴缃€丷16-R19 瑙勫垯

**浠ｇ爜鎻愪氦**: `v1.0.0-milestone` tag 閿佸畾

**鏂囨。鏇存柊**: 璁捐鏂囨。 v5.0.0銆丼KILL-鎻掍欢瑙嗗浘寮€鍙?v2.0.0銆佹椂闂磋鍥捐璁℃柟妗?v5.0銆丆ONTEXT.md R16-R19

---



## 2026-06-06

- 淇妯悜婊氬姩鏃堕棿杞撮伄鎸′笌閿氬畾鍖烘秷澶遍棶棰?
*锛堝悗缁璇濆皢鑷姩杩藉姞锛?

