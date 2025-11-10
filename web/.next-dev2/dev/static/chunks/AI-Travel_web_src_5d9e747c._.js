(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/AI-Travel/web/src/components/MapView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MapView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function MapView({ center = [
    116.397428,
    39.90923
], zoom = 12, markers = [], routePath, className = "" }) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [ready, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Lazy init: wait for AMap to be available even if script loads after render
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapView.useEffect": ()=>{
            let timer;
            const tryInit = {
                "MapView.useEffect.tryInit": ()=>{
                    const amap = window.AMap;
                    if (!amap || !ref.current) {
                        setReady(false);
                        return;
                    }
                    if (!mapRef.current) {
                        setReady(true);
                        mapRef.current = new amap.Map(ref.current, {
                            zoom,
                            center,
                            viewMode: "2D"
                        });
                    }
                    // update overlays
                    try {
                        mapRef.current.clearMap();
                    } catch  {}
                    markers.forEach({
                        "MapView.useEffect.tryInit": (m)=>{
                            const marker = new amap.Marker({
                                position: m.position,
                                title: m.title
                            });
                            mapRef.current.add(marker);
                        }
                    }["MapView.useEffect.tryInit"]);
                    if (routePath && routePath.length >= 2) {
                        const polyline = new amap.Polyline({
                            path: routePath,
                            strokeColor: "#2563eb",
                            strokeWeight: 5,
                            strokeOpacity: 0.9
                        });
                        mapRef.current.add(polyline);
                        try {
                            mapRef.current.setFitView([
                                polyline
                            ]);
                        } catch  {}
                    } else {
                        try {
                            mapRef.current.setZoomAndCenter(zoom, center);
                        } catch  {}
                    }
                }
            }["MapView.useEffect.tryInit"];
            // attempt immediately and then poll briefly if not ready
            tryInit();
            if (!mapRef.current) {
                timer = setInterval({
                    "MapView.useEffect": ()=>{
                        tryInit();
                        if (mapRef.current) clearInterval(timer);
                    }
                }["MapView.useEffect"], 200);
            }
            return ({
                "MapView.useEffect": ()=>{
                    if (timer) clearInterval(timer);
                    try {
                        mapRef.current?.destroy?.();
                    } catch  {}
                    mapRef.current = null;
                }
            })["MapView.useEffect"];
        }
    }["MapView.useEffect"], [
        center,
        zoom,
        markers,
        routePath
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            "relative overflow-hidden rounded-xl border border-gray-200",
            className
        ].join(" "),
        style: {
            height: "100%",
            width: "100%"
        },
        children: [
            !ready && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 flex items-center justify-center text-sm text-gray-500",
                children: "地图未加载，请配置 `NEXT_PUBLIC_AMAP_KEY`"
            }, void 0, false, {
                fileName: "[project]/AI-Travel/web/src/components/MapView.tsx",
                lineNumber: 75,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: ref,
                className: "w-full h-full"
            }, void 0, false, {
                fileName: "[project]/AI-Travel/web/src/components/MapView.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/AI-Travel/web/src/components/MapView.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
_s(MapView, "QggA1kVjlo48ICm4O7vUHlmgHrQ=");
_c = MapView;
var _c;
__turbopack_context__.k.register(_c, "MapView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/AI-Travel/web/src/components/VoiceButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VoiceButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function VoiceButton({ onTranscribe, className = "" }) {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [mode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("iflytek");
    const streamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const recRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chunksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const wsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioCtxRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const processorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const textRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("");
    const tokensRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]); // 累积识别词元，支持 wpgs 动态修正
    // 将 Float32 PCM 转为 16bit PCM 并 base64
    const floatTo16kBase64 = (input, inputSampleRate, targetRate = 16000)=>{
        let samples = input;
        if (inputSampleRate !== targetRate) {
            const ratio = inputSampleRate / targetRate;
            const newLength = Math.round(input.length / ratio);
            const resampled = new Float32Array(newLength);
            for(let i = 0; i < newLength; i++){
                const idx = Math.round(i * ratio);
                resampled[i] = input[Math.min(idx, input.length - 1)];
            }
            samples = resampled;
        }
        const buffer = new ArrayBuffer(samples.length * 2);
        const view = new DataView(buffer);
        for(let i = 0; i < samples.length; i++){
            let s = Math.max(-1, Math.min(1, samples[i]));
            view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }
        const u8 = new Uint8Array(buffer);
        let binary = "";
        const chunkSize = 0x8000;
        for(let i = 0; i < u8.length; i += chunkSize){
            binary += String.fromCharCode.apply(null, Array.from(u8.subarray(i, i + chunkSize)));
        }
        return btoa(binary);
    };
    const parseIatText = (msg)=>{
        try {
            const ws = msg?.data?.result?.ws || [];
            const parts = [];
            for (const w of ws){
                const cw = w?.cw || [];
                if (cw[0]?.w) parts.push(cw[0].w);
            }
            return parts.join("");
        } catch  {
            return "";
        }
    };
    const startIflytek = async ()=>{
        try {
            const signRes = await fetch("/api/voice/iflytek/sign");
            if (signRes.status === 501) {
                setState("error");
                setMessage("未配置讯飞密钥，请在 .env.local 配置 IFLYTEK_APP_ID/KEY/SECRET");
                return;
            }
            const { wsUrl, appId } = await signRes.json();
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            streamRef.current = stream;
            // 使用默认设备采样率，避免部分浏览器不支持强制 16000 采样率
            const AC = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AC();
            audioCtxRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            const processor = audioCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;
            textRef.current = "";
            setState("recording");
            setMessage("录音中（讯飞）...");
            ws.onopen = ()=>{
                // 发送开始帧
                const startFrame = {
                    common: {
                        app_id: appId
                    },
                    business: {
                        language: "zh_cn",
                        domain: "iat",
                        accent: "mandarin",
                        // 启用动态修正以便实时返回片段
                        dwa: "wpgs",
                        vad_eos: 5000
                    },
                    data: {
                        status: 0,
                        format: "audio/L16;rate=16000",
                        encoding: "raw",
                        audio: ""
                    }
                };
                ws.send(JSON.stringify(startFrame));
                processor.onaudioprocess = (e)=>{
                    const input = e.inputBuffer.getChannelData(0);
                    const base64 = floatTo16kBase64(input, audioCtx.sampleRate, 16000);
                    const frame = {
                        data: {
                            status: 1,
                            format: "audio/L16;rate=16000",
                            encoding: "raw",
                            audio: base64
                        }
                    };
                    ws.send(JSON.stringify(frame));
                };
                source.connect(processor);
                processor.connect(audioCtx.destination);
                tokensRef.current = [];
            };
            ws.onmessage = async (ev)=>{
                try {
                    let data;
                    if (typeof ev.data === "string") {
                        data = JSON.parse(ev.data);
                    } else if (ev.data instanceof Blob) {
                        data = JSON.parse(await ev.data.text());
                    } else if (ev.data instanceof ArrayBuffer) {
                        data = JSON.parse(new TextDecoder().decode(ev.data));
                    } else {
                        data = ev.data;
                    }
                    if (data.code !== 0) {
                        setState("error");
                        setMessage(data.message || "讯飞识别错误");
                        return;
                    }
                    const status = data?.data?.status;
                    const result = data?.data?.result || {};
                    const wsArr = result.ws || [];
                    const pgs = result.pgs; // 'apd' 追加 或 'rpl' 替换
                    const rg = result.rg || []; // [start, end] 1-based
                    const words = [];
                    for (const w of wsArr){
                        const cw = w?.cw || [];
                        if (cw[0]?.w) words.push(cw[0].w);
                    }
                    if (words.length) {
                        if (pgs === "rpl" && Array.isArray(rg) && rg.length === 2) {
                            const start = Math.max(0, Number(rg[0]) - 1);
                            const end = Math.min(tokensRef.current.length, Number(rg[1]));
                            tokensRef.current.splice(start, end - start, ...words);
                        } else {
                            tokensRef.current.push(...words);
                        }
                        const full = tokensRef.current.join("");
                        setMessage(full);
                        textRef.current = full;
                        if (status === 2) {
                            setState("done");
                            onTranscribe?.(full);
                            try {
                                ws.close();
                            } catch  {}
                        }
                    }
                } catch (e) {
                    setState("error");
                    setMessage(e?.message || "讯飞消息解析失败");
                }
            };
            ws.onerror = ()=>{
                // 连接失败时提示并保持错误状态，不回退，以确保使用讯飞方案
                try {
                    source.disconnect();
                    processor.disconnect();
                    if (audioCtx.state !== "closed") audioCtx.close();
                    stream.getTracks().forEach((t)=>t.stop());
                } catch  {}
                setState("error");
                setMessage("讯飞连接错误，请检查密钥、系统时间或网络");
            };
            ws.onclose = (ev)=>{
                if (textRef.current) {
                    setState("done");
                    onTranscribe?.(textRef.current);
                } else if (state === "recording") {
                    // 若正在录音被关闭，则恢复为空闲
                    setState("idle");
                    setMessage("已停止");
                }
                // 清理资源
                try {
                    source.disconnect();
                    processor.disconnect();
                    if (audioCtx.state !== "closed") audioCtx.close();
                    stream.getTracks().forEach((t)=>t.stop());
                } catch  {}
            };
        } catch (e) {
            setState("error");
            setMessage(e?.message || "讯飞启动失败");
        }
    };
    // 浏览器语音识别回退
    const startBrowserSpeech = ()=>{
        const SR = window.webkitSpeechRecognition || window.SpeechRecognition;
        if (!SR) {
            setState("error");
            setMessage("浏览器不支持 Web Speech API");
            return;
        }
        const recog = new SR();
        recog.lang = "zh-CN";
        recog.continuous = false;
        recog.interimResults = false;
        setState("recording");
        recog.onresult = (ev)=>{
            const text = ev.results?.[0]?.[0]?.transcript || "";
            setState("done");
            setMessage(text);
            onTranscribe?.(text);
        };
        recog.onerror = (e)=>{
            setState("error");
            setMessage(e?.message || "识别失败");
        };
        recog.onend = ()=>{
            if (state === "recording") setState("idle");
        };
        recog.start();
    };
    const startRecording = async ()=>{
        await startIflytek();
    };
    const stopRecording = ()=>{
        // 发送结束帧（若连接已打开）
        try {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    data: {
                        status: 2,
                        format: "audio/L16;rate=16000",
                        encoding: "raw",
                        audio: ""
                    }
                }));
            }
        } catch  {}
        // 停止音频处理与关闭连接
        try {
            if (processorRef.current) {
                processorRef.current.onaudioprocess = null;
                processorRef.current.disconnect();
            }
        } catch  {}
        try {
            if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
                audioCtxRef.current.close();
            }
        } catch  {}
        // 允许服务端返回最终结果，再延迟关闭 WebSocket
        try {
            if (wsRef.current) {
                const ws = wsRef.current;
                setTimeout(()=>{
                    try {
                        if (ws.readyState === WebSocket.OPEN) ws.close();
                    } catch  {}
                }, 800);
            }
        } catch  {}
        processorRef.current = null;
        audioCtxRef.current = null;
        wsRef.current = null;
        // 停止麦克风流
        try {
            streamRef.current?.getTracks().forEach((t)=>t.stop());
        } catch  {}
        streamRef.current = null;
        // 切为“转写中”，提示稍后生成路线
        setState("transcribing");
        setMessage("已停止，处理中...");
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VoiceButton.useEffect": ()=>({
                "VoiceButton.useEffect": ()=>stopRecording()
            })["VoiceButton.useEffect"]
    }["VoiceButton.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            "flex items-center gap-2",
            className
        ].join(" "),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "rounded bg-black px-3 py-1.5 text-white disabled:opacity-60",
                onClick: state === "recording" ? stopRecording : startRecording,
                children: state === "recording" ? "停止" : "语音输入"
            }, void 0, false, {
                fileName: "[project]/AI-Travel/web/src/components/VoiceButton.tsx",
                lineNumber: 290,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs text-zinc-500",
                children: message
            }, void 0, false, {
                fileName: "[project]/AI-Travel/web/src/components/VoiceButton.tsx",
                lineNumber: 297,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/AI-Travel/web/src/components/VoiceButton.tsx",
        lineNumber: 289,
        columnNumber: 5
    }, this);
}
_s(VoiceButton, "aw4rljnNAl8En9XyyMMT/IhUYWU=");
_c = VoiceButton;
var _c;
__turbopack_context__.k.register(_c, "VoiceButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/AI-Travel/web/src/components/Card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Card
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function Card({ title, actions, className = "", children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            "rounded-xl border border-gray-200 bg-white shadow-sm",
            className
        ].join(" "),
        children: [
            (title || actions) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-4 py-3 border-b border-gray-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-semibold text-gray-900",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/AI-Travel/web/src/components/Card.tsx",
                        lineNumber: 16,
                        columnNumber: 11
                    }, this),
                    actions
                ]
            }, void 0, true, {
                fileName: "[project]/AI-Travel/web/src/components/Card.tsx",
                lineNumber: 15,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4",
                children: children
            }, void 0, false, {
                fileName: "[project]/AI-Travel/web/src/components/Card.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/AI-Travel/web/src/components/Card.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Card;
var _c;
__turbopack_context__.k.register(_c, "Card");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/AI-Travel/web/src/components/Badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Badge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
const variants = {
    default: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
    gray: "bg-gray-100 text-gray-700 ring-gray-200"
};
function Badge({ children, variant = "default", className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: [
            "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
            variants[variant],
            className
        ].join(" "),
        children: children
    }, void 0, false, {
        fileName: "[project]/AI-Travel/web/src/components/Badge.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c = Badge;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/AI-Travel/web/src/components/BudgetPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BudgetPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function avgPrice(range) {
    if (!range || range.length !== 2) return 0;
    const a = Number(range[0]);
    const b = Number(range[1]);
    if (Number.isFinite(a) && Number.isFinite(b)) return (a + b) / 2;
    return 0;
}
function ticketToNumber(t) {
    if (t == null) return 0;
    if (typeof t === "number" && Number.isFinite(t)) return t;
    const n = Number(t);
    return Number.isFinite(n) ? n : 0;
}
function BudgetPanel({ days }) {
    _s();
    const [totalBudget, setTotalBudget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BudgetPanel.useEffect": ()=>{
            try {
                const raw = localStorage.getItem("lastPrefs");
                if (raw) {
                    const p = JSON.parse(raw);
                    if (typeof p?.budgetTotal === "number") setTotalBudget(p.budgetTotal);
                }
            } catch  {}
        }
    }["BudgetPanel.useEffect"], []);
    const { byDay, totals } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BudgetPanel.useMemo": ()=>{
            const byDay = [];
            let transport = 0, dining = 0, lodging = 0, tickets = 0;
            for (const d of days || []){
                const t = Number(d.transport?.priceEstimate) || 0;
                const dine = (d.dining || []).reduce({
                    "BudgetPanel.useMemo.dine": (s, it)=>s + avgPrice(it.priceRange)
                }["BudgetPanel.useMemo.dine"], 0);
                const lodge = (d.lodging || []).reduce({
                    "BudgetPanel.useMemo.lodge": (s, it)=>s + (Number(it.price) || 0)
                }["BudgetPanel.useMemo.lodge"], 0);
                const tick = (d.attractions || []).reduce({
                    "BudgetPanel.useMemo.tick": (s, it)=>s + ticketToNumber(it.ticket)
                }["BudgetPanel.useMemo.tick"], 0);
                const total = t + dine + lodge + tick;
                byDay.push({
                    date: d.date,
                    transport: t,
                    dining: dine,
                    lodging: lodge,
                    tickets: tick,
                    total
                });
                transport += t;
                dining += dine;
                lodging += lodge;
                tickets += tick;
            }
            const grand = transport + dining + lodging + tickets;
            return {
                byDay,
                totals: {
                    transport,
                    dining,
                    lodging,
                    tickets,
                    grand
                }
            };
        }
    }["BudgetPanel.useMemo"], [
        days
    ]);
    const maxCategory = Math.max(1, totals.grand, totals.transport, totals.dining, totals.lodging, totals.tickets);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-lg border border-zinc-200 p-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm font-medium",
                        children: "预算管理"
                    }, void 0, false, {
                        fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    typeof totalBudget === "number" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-zinc-600",
                        children: [
                            "总预算：",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold text-zinc-900",
                                children: [
                                    "¥",
                                    Math.round(totalBudget)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                                lineNumber: 74,
                                columnNumber: 54
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-zinc-500",
                        children: "未设置总预算（偏好中可设置）"
                    }, void 0, false, {
                        fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 grid grid-cols-1 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-zinc-600",
                                children: "估算总支出"
                            }, void 0, false, {
                                fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold",
                                        children: [
                                            "¥",
                                            Math.round(totals.grand)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                                        lineNumber: 84,
                                        columnNumber: 13
                                    }, this),
                                    typeof totalBudget === "number" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-2 text-xs text-zinc-500",
                                        children: [
                                            "（剩余：¥",
                                            Math.round(totalBudget - totals.grand),
                                            "）"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                                        lineNumber: 86,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            {
                                label: "交通",
                                value: totals.transport,
                                color: "bg-blue-500"
                            },
                            {
                                label: "餐饮",
                                value: totals.dining,
                                color: "bg-orange-500"
                            },
                            {
                                label: "住宿",
                                value: totals.lodging,
                                color: "bg-purple-500"
                            },
                            {
                                label: "门票",
                                value: totals.tickets,
                                color: "bg-emerald-500"
                            }
                        ].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-zinc-600",
                                                children: c.label
                                            }, void 0, false, {
                                                fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                                                lineNumber: 100,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-zinc-900",
                                                children: [
                                                    "¥",
                                                    Math.round(c.value)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                                                lineNumber: 101,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                                        lineNumber: 99,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 h-2 rounded bg-zinc-100",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: [
                                                "h-2 rounded",
                                                c.color
                                            ].join(" "),
                                            style: {
                                                width: `${Math.min(100, c.value / maxCategory * 100)}%`
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                                            lineNumber: 104,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                                        lineNumber: 103,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, c.label, true, {
                                fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                                lineNumber: 98,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-zinc-600 mb-1",
                                children: "按天估算"
                            }, void 0, false, {
                                fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1",
                                children: byDay.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-zinc-600",
                                                children: d.date
                                            }, void 0, false, {
                                                fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                                                lineNumber: 117,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-zinc-900",
                                                children: [
                                                    "¥",
                                                    Math.round(d.total)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                                                lineNumber: 118,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, d.date, true, {
                                        fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                                        lineNumber: 116,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/AI-Travel/web/src/components/BudgetPanel.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_s(BudgetPanel, "4ZkoSWBy60Dk/gpR6vSdfkq8o7w=");
_c = BudgetPanel;
var _c;
__turbopack_context__.k.register(_c, "BudgetPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/AI-Travel/web/src/app/plan/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PlanPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$components$2f$MapView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/src/components/MapView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$components$2f$VoiceButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/src/components/VoiceButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/src/components/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$components$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/src/components/Badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/src/components/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$components$2f$BudgetPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/src/components/BudgetPanel.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function useRouteQuery(params) {
    _s();
    const { origin = "北京站", destination = "天安门", type = "driving", originCoord = "116.4336,39.9024", destinationCoord = "116.3975,39.9087" } = params;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "route",
            origin,
            destination,
            originCoord,
            destinationCoord,
            type
        ],
        queryFn: {
            "useRouteQuery.useQuery": async ()=>{
                const u = new URL("/api/map/route", window.location.origin);
                u.searchParams.set("origin", originCoord);
                u.searchParams.set("destination", destinationCoord);
                u.searchParams.set("type", type);
                const res = await fetch(u.toString());
                if (res.status === 501) {
                    // 后端未配置 AMAP_WEBSERVICE_KEY 时返回 501，占位忽略错误以避免打断页面
                    return null;
                }
                if (!res.ok) {
                    const msg = await res.text().catch({
                        "useRouteQuery.useQuery": ()=>"route api error"
                    }["useRouteQuery.useQuery"]);
                    throw new Error(msg || "route api error");
                }
                return res.json();
            }
        }["useRouteQuery.useQuery"],
        enabled: !!originCoord && !!destinationCoord
    });
}
_s(useRouteQuery, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function PlanPage() {
    _s1();
    const [origin, setOrigin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("北京站");
    const [destination, setDestination] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("天安门");
    const [originCoord, setOriginCoord] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("116.4336,39.9024");
    const [destinationCoord, setDestinationCoord] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("116.3975,39.9087");
    const [type, setType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("driving");
    const [selectedDay, setSelectedDay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [highlightItemId, setHighlightItemId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [focusMarkers, setFocusMarkers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filterText, setFilterText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [timeFilter, setTimeFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [showPrefs, setShowPrefs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [generating, setGenerating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [genError, setGenError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [destInput, setDestInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [startInput, setStartInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [endInput, setEndInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [pace, setPace] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("standard");
    const [interestsText, setInterestsText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [budgetInput, setBudgetInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // 主页生成的行程数据（localStorage 注入）
    const [plan, setPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PlanPage.useEffect": ()=>{
            try {
                const raw = localStorage.getItem("lastPlan");
                if (raw) {
                    const obj = JSON.parse(raw);
                    if (obj && obj.destination && obj.days) setPlan(obj);
                }
                const prefsRaw = localStorage.getItem("lastPrefs");
                if (prefsRaw) {
                    const pj = JSON.parse(prefsRaw);
                    if (pj?.pace) setPace(pj.pace);
                    if (Array.isArray(pj?.interests)) setInterestsText(pj.interests.join(", "));
                    if (typeof pj?.budgetTotal === "number") setBudgetInput(String(pj.budgetTotal));
                }
            } catch  {}
        }
    }["PlanPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PlanPage.useEffect": ()=>{
            // 行程更新时默认选中第 1 天并清空高亮
            setSelectedDay(0);
            setHighlightItemId(null);
            setFocusMarkers([]);
        }
    }["PlanPage.useEffect"], [
        plan?.destination,
        plan?.start_date,
        plan?.end_date,
        plan?.days?.length
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PlanPage.useEffect": ()=>{
            if (showPrefs && plan) {
                setDestInput(plan.destination || "");
                setStartInput(plan.start_date || "");
                setEndInput(plan.end_date || "");
            }
        }
    }["PlanPage.useEffect"], [
        showPrefs
    ]);
    const { data, isLoading, error, refetch } = useRouteQuery({
        origin,
        destination,
        originCoord,
        destinationCoord,
        type
    });
    const routePath = data?.polyline ?? [];
    const planMarkers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PlanPage.useMemo[planMarkers]": ()=>plan?.markers ?? []
    }["PlanPage.useMemo[planMarkers]"], [
        plan
    ]);
    const markersToRender = focusMarkers.length ? focusMarkers : planMarkers;
    const center = focusMarkers.length ? focusMarkers[0].position : routePath.length ? routePath[0] : planMarkers.length ? planMarkers[0].position : [
        116.397428,
        39.90923
    ];
    // 解析“从xxx到xxx”并生成路线
    const handleTranscribe = async (text)=>{
        // 清理换行/多余空格/句末标点，并解析“从xxx到xxx”
        const cleaned = String(text).replace(/[\n\r]+/g, " ").replace(/\s+/g, " ").replace(/[，,。.!！?？]+$/g, "").trim();
        const m = cleaned.match(/从\s*(.+?)\s*到\s*(.+)$/);
        if (!m) {
            // 不匹配则忽略
            return;
        }
        const fromName = m[1].trim();
        const toName = m[2].trim();
        const extractCity = (n)=>{
            const cities = [
                "北京",
                "天津",
                "上海",
                "重庆",
                "广州",
                "深圳",
                "杭州",
                "苏州",
                "南京",
                "武汉",
                "成都",
                "西安",
                "青岛",
                "大连",
                "沈阳",
                "长春",
                "哈尔滨",
                "济南",
                "郑州",
                "佛山",
                "宁波",
                "无锡",
                "厦门",
                "福州",
                "合肥",
                "长沙",
                "南昌",
                "昆明",
                "石家庄",
                "太原",
                "兰州",
                "呼和浩特",
                "贵阳",
                "南宁",
                "海口",
                "唐山",
                "保定"
            ];
            for (const c of cities){
                if (n.includes(c)) return c;
            }
            const m = n.match(/([\u4e00-\u9fa5]+)市/);
            if (m) return m[1];
            return "";
        };
        const resolvePoi = async (name)=>{
            const city = extractCity(name);
            const u = new URL("/api/map/search", window.location.origin);
            u.searchParams.set("query", name);
            if (city) u.searchParams.set("city", city);
            const resp = await fetch(u.toString());
            if (!resp.ok) return null;
            const jd = await resp.json().catch(()=>null);
            const pois = jd?.pois || [];
            if (!pois.length) return null;
            const norm = (s)=>s.replace(/\s+/g, "").toLowerCase();
            const target = norm(name);
            const exact = pois.find((p)=>norm(p.name) === target);
            if (exact) return {
                name,
                coord: `${exact.location.lng},${exact.location.lat}`
            };
            const byCity = city ? pois.find((p)=>(p.cityname?.includes(city) || p.adname?.includes(city)) && norm(p.name).includes(target)) : null;
            const poi = byCity || pois[0];
            return {
                name,
                coord: `${poi.location.lng},${poi.location.lat}`
            };
        };
        // 先把左侧输入同步为语音文本
        setOrigin(fromName);
        setDestination(toName);
        const from = await resolvePoi(fromName);
        const to = await resolvePoi(toName);
        if (from) setOriginCoord(from.coord);
        if (to) setDestinationCoord(to.coord);
        // 触发路线查询
        refetch();
    };
    // 根据经纬度在地图上定位并高亮
    const handleLocatePoint = (lat, lng, title)=>{
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
        setFocusMarkers([
            {
                position: [
                    lng,
                    lat
                ],
                title
            }
        ]);
        // 清除路线以突出标记
        setOriginCoord("");
        setDestinationCoord("");
    };
    // 根据名称解析坐标并定位（优先使用计划目的地作为城市范围）
    const locateByPlaceName = async (name)=>{
        const extractCity = (n)=>{
            const cities = [
                "北京",
                "天津",
                "上海",
                "重庆",
                "广州",
                "深圳",
                "杭州",
                "苏州",
                "南京",
                "武汉",
                "成都",
                "西安",
                "青岛",
                "大连",
                "沈阳",
                "长春",
                "哈尔滨",
                "济南",
                "郑州",
                "佛山",
                "宁波",
                "无锡",
                "厦门",
                "福州",
                "合肥",
                "长沙",
                "南昌",
                "昆明",
                "石家庄",
                "太原",
                "兰州",
                "呼和浩特",
                "贵阳",
                "南宁",
                "海口",
                "唐山",
                "保定"
            ];
            for (const c of cities){
                if ((plan?.destination || "").includes(c) || n.includes(c)) return c;
            }
            const m = n.match(/([\u4e00-\u9fa5]+)市/);
            if (m) return m[1];
            return plan?.destination || "";
        };
        const city = extractCity(name || plan?.destination || "");
        const u = new URL("/api/map/search", window.location.origin);
        u.searchParams.set("query", name);
        if (city) u.searchParams.set("city", city);
        const resp = await fetch(u.toString());
        if (!resp.ok) return;
        const jd = await resp.json().catch(()=>null);
        const pois = jd?.pois || [];
        if (!pois.length) return;
        const poi = pois[0];
        const lng = Number(poi.location?.lng);
        const lat = Number(poi.location?.lat);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            handleLocatePoint(lat, lng, name);
        }
    };
    // 手动查询按钮：若坐标未与名称匹配，则自动解析坐标
    const handleQueryRoute = async ()=>{
        const extractCity = (n)=>{
            const cities = [
                "北京",
                "天津",
                "上海",
                "重庆",
                "广州",
                "深圳",
                "杭州",
                "苏州",
                "南京",
                "武汉",
                "成都",
                "西安",
                "青岛",
                "大连",
                "沈阳",
                "长春",
                "哈尔滨",
                "济南",
                "郑州",
                "佛山",
                "宁波",
                "无锡",
                "厦门",
                "福州",
                "合肥",
                "长沙",
                "南昌",
                "昆明",
                "石家庄",
                "太原",
                "兰州",
                "呼和浩特",
                "贵阳",
                "南宁",
                "海口",
                "唐山",
                "保定"
            ];
            for (const c of cities){
                if (n.includes(c)) return c;
            }
            const m = n.match(/([\u4e00-\u9fa5]+)市/);
            if (m) return m[1];
            return "";
        };
        const resolvePoi = async (name)=>{
            const city = extractCity(name);
            const u = new URL("/api/map/search", window.location.origin);
            u.searchParams.set("query", name);
            if (city) u.searchParams.set("city", city);
            const resp = await fetch(u.toString());
            if (!resp.ok) return null;
            const jd = await resp.json().catch(()=>null);
            const pois = jd?.pois || [];
            if (!pois.length) return null;
            const norm = (s)=>s.replace(/\s+/g, "").toLowerCase();
            const target = norm(name);
            const exact = pois.find((p)=>norm(p.name) === target);
            if (exact) return {
                name,
                coord: `${exact.location.lng},${exact.location.lat}`
            };
            const byCity = city ? pois.find((p)=>(p.cityname?.includes(city) || p.adname?.includes(city)) && norm(p.name).includes(target)) : null;
            const poi = byCity || pois[0];
            return {
                name,
                coord: `${poi.location.lng},${poi.location.lat}`
            };
        };
        // 若坐标仍是默认或未更新，则尝试用名称解析
        if (!originCoord || originCoord === "116.4336,39.9024") {
            const from = await resolvePoi(origin);
            if (from) {
                setOrigin(from.name);
                setOriginCoord(from.coord);
            }
        }
        if (!destinationCoord || destinationCoord === "116.3975,39.9087") {
            const to = await resolvePoi(destination);
            if (to) {
                setDestination(to.name);
                setDestinationCoord(to.coord);
            }
        }
        refetch();
    };
    // 点击时间线条目：解析前后两点并在地图上绘制当天局部路线
    const handleItemClick = async (dayIndex, itemIndex)=>{
        if (!plan || !plan.days[dayIndex]) return;
        setSelectedDay(dayIndex);
        const day = plan.days[dayIndex];
        const cur = day.items[itemIndex];
        setHighlightItemId(cur.id ?? null);
        const extractCity = (n)=>{
            const cities = [
                "北京",
                "天津",
                "上海",
                "重庆",
                "广州",
                "深圳",
                "杭州",
                "苏州",
                "南京",
                "武汉",
                "成都",
                "西安",
                "青岛",
                "大连",
                "沈阳",
                "长春",
                "哈尔滨",
                "济南",
                "郑州",
                "佛山",
                "宁波",
                "无锡",
                "厦门",
                "福州",
                "合肥",
                "长沙",
                "南昌",
                "昆明",
                "石家庄",
                "太原",
                "兰州",
                "呼和浩特",
                "贵阳",
                "南宁",
                "海口",
                "唐山",
                "保定"
            ];
            for (const c of cities){
                if ((plan?.destination || "").includes(c) || n.includes(c)) return c;
            }
            const m = n.match(/([\u4e00-\u9fa5]+)市/);
            if (m) return m[1];
            return "";
        };
        const resolvePoi = async (name)=>{
            const city = extractCity(name || plan?.destination || "");
            const u = new URL("/api/map/search", window.location.origin);
            u.searchParams.set("query", name);
            if (city) u.searchParams.set("city", city);
            const resp = await fetch(u.toString());
            if (!resp.ok) return null;
            const jd = await resp.json().catch(()=>null);
            const pois = jd?.pois || [];
            if (!pois.length) return null;
            const poi = pois[0];
            return {
                name,
                coord: `${poi.location.lng},${poi.location.lat}`,
                pos: [
                    poi.location.lng,
                    poi.location.lat
                ]
            };
        };
        // 前一个点（若不存在则使用当天第一个或默认起点名）
        const prev = day.items[itemIndex - 1];
        const fromName = prev?.place?.name || prev?.title || day.items[0]?.place?.name || day.items[0]?.title || origin;
        const toName = cur?.place?.name || cur.title;
        const from = await resolvePoi(fromName);
        const to = await resolvePoi(toName);
        if (!to) return;
        if (from) {
            setOrigin(from.name);
            setOriginCoord(from.coord);
        }
        setDestination(to.name);
        setDestinationCoord(to.coord);
        setType("walking");
        setFocusMarkers([
            from?.pos ? {
                position: from.pos,
                title: from.name
            } : undefined,
            to.pos ? {
                position: to.pos,
                title: to.name
            } : undefined
        ].filter(Boolean));
        refetch();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 space-y-4",
        children: [
            plan && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "最新生成行程",
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    size: "sm",
                    variant: "secondary",
                    onClick: ()=>setShowPrefs(true),
                    children: "偏好与重新生成"
                }, void 0, false, {
                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                    lineNumber: 304,
                    columnNumber: 39
                }, void 0),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm font-medium flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: plan.destination
                                    }, void 0, false, {
                                        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                        lineNumber: 307,
                                        columnNumber: 15
                                    }, this),
                                    plan.source === "fallback" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$components$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        variant: "warning",
                                        className: "ml-1",
                                        children: "使用兜底数据"
                                    }, void 0, false, {
                                        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                        lineNumber: 309,
                                        columnNumber: 17
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                lineNumber: 306,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$components$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                variant: "gray",
                                children: [
                                    plan.start_date,
                                    " → ",
                                    plan.end_date
                                ]
                            }, void 0, true, {
                                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                lineNumber: 312,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                        lineNumber: 305,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-2",
                                children: [
                                    plan.days.map((d, di)=>{
                                        const diningCount = Array.isArray(d.dining) ? d.dining.length : 0;
                                        const lodgingCount = Array.isArray(d.lodging) ? d.lodging.length : 0;
                                        const attractionCount = Array.isArray(d.attractions) ? d.attractions.length : 0;
                                        const transportShort = d.transport ? `${d.transport.mode || "-"} · ${typeof d.transport.timeEstimate === "number" ? `${Math.round(d.transport.timeEstimate)}m` : "--"} · ${typeof d.transport.priceEstimate === "number" ? `￥${Math.round(d.transport.priceEstimate)}` : "--"}` : "无交通信息";
                                        const previewItems = (d.items || []).slice(0, 2).map((it)=>`${it.time ? it.time + " " : ""}${it?.place?.name || it.title}`).join(" · ");
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: [
                                                "w-full mb-2 rounded border p-2 text-left",
                                                di === selectedDay ? "border-blue-500 bg-blue-50" : "border-zinc-200 hover:bg-zinc-50"
                                            ].join(" "),
                                            onClick: ()=>setSelectedDay(di),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs font-medium",
                                                            children: d.date
                                                        }, void 0, false, {
                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                            lineNumber: 331,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 text-[11px] text-zinc-600",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: [
                                                                        "🍽️",
                                                                        diningCount
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                    lineNumber: 333,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: [
                                                                        "🏨",
                                                                        lodgingCount
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                    lineNumber: 334,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: [
                                                                        "📍",
                                                                        attractionCount
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                    lineNumber: 335,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                            lineNumber: 332,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                    lineNumber: 330,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-1 text-[11px] text-zinc-600 truncate",
                                                    children: previewItems || "无活动预览"
                                                }, void 0, false, {
                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                    lineNumber: 338,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-1 text-[11px] text-zinc-600",
                                                    children: transportShort
                                                }, void 0, false, {
                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                    lineNumber: 339,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, d.date, true, {
                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                            lineNumber: 328,
                                            columnNumber: 19
                                        }, this);
                                    }),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 rounded border border-zinc-200 bg-white/70 p-2 text-[12px] text-zinc-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-1 flex items-center justify-between",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-medium text-zinc-800",
                                                    children: "预算管理"
                                                }, void 0, false, {
                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                    lineNumber: 346,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                lineNumber: 345,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "max-h-[260px] overflow-y-auto",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$components$2f$BudgetPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    days: plan.days
                                                }, void 0, false, {
                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                    lineNumber: 349,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                lineNumber: 348,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                        lineNumber: 344,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                lineNumber: 317,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    title: `${plan.days[selectedDay]?.date || ""} 详细`,
                                    children: (()=>{
                                        const d = plan.days[selectedDay];
                                        if (!d) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-zinc-500",
                                            children: "无当天数据"
                                        }, void 0, false, {
                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                            lineNumber: 358,
                                            columnNumber: 34
                                        }, this);
                                        const matchText = (it)=>{
                                            const q = filterText.trim().toLowerCase();
                                            if (!q) return true;
                                            return String(it?.place?.name || it.title || "").toLowerCase().includes(q) || String(it.note || "").toLowerCase().includes(q);
                                        };
                                        const matchTime = (it)=>{
                                            if (timeFilter === "all") return true;
                                            const m = String(it.time || "").match(/^(\d{1,2}):(\d{2})/);
                                            if (!m) return true;
                                            const h = Number(m[1]);
                                            if (timeFilter === "morning") return h < 12;
                                            if (timeFilter === "afternoon") return h >= 12 && h < 17;
                                            if (timeFilter === "evening") return h >= 17;
                                            return true;
                                        };
                                        const items = d.items.filter((it)=>matchText(it) && matchTime(it));
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "space-y-1",
                                                    children: [
                                                        items.map((it, ii)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                className: [
                                                                    "cursor-pointer rounded px-1 py-0.5 text-xs",
                                                                    highlightItemId === it.id ? "bg-blue-100 text-blue-700" : "text-zinc-700 hover:bg-zinc-100"
                                                                ].join(" "),
                                                                onClick: ()=>handleItemClick(selectedDay, ii),
                                                                children: [
                                                                    it.time ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "mr-2 text-zinc-500",
                                                                        children: it.time
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                        lineNumber: 384,
                                                                        columnNumber: 40
                                                                    }, this) : null,
                                                                    it?.place?.name || it.title,
                                                                    it.note ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "ml-2 text-zinc-400",
                                                                        children: it.note
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                        lineNumber: 386,
                                                                        columnNumber: 40
                                                                    }, this) : null
                                                                ]
                                                            }, it.id || `${d.date}-${ii}`, true, {
                                                                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                lineNumber: 382,
                                                                columnNumber: 27
                                                            }, this)),
                                                        items.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "text-[12px] text-zinc-500",
                                                            children: "该筛选下暂无活动"
                                                        }, void 0, false, {
                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                            lineNumber: 390,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                    lineNumber: 380,
                                                    columnNumber: 23
                                                }, this),
                                                d.transport && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-2 rounded bg-white/60 p-2 text-[12px] text-zinc-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-medium text-zinc-800",
                                                            children: "交通"
                                                        }, void 0, false, {
                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                            lineNumber: 396,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-1",
                                                            children: [
                                                                "方式：",
                                                                String(d.transport.mode || "").trim() || "-"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                            lineNumber: 397,
                                                            columnNumber: 27
                                                        }, this),
                                                        Array.isArray(d.transport.steps) && d.transport.steps.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-1",
                                                            children: [
                                                                "步骤：",
                                                                d.transport.steps.join("，")
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                            lineNumber: 399,
                                                            columnNumber: 29
                                                        }, this) : null,
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-1",
                                                            children: [
                                                                "耗时：",
                                                                typeof d.transport.timeEstimate === "number" ? `${Math.round(d.transport.timeEstimate)} 分钟` : "-"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                            lineNumber: 401,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-1",
                                                            children: [
                                                                "费用：",
                                                                typeof d.transport.priceEstimate === "number" ? `${Math.round(d.transport.priceEstimate)} 元` : "-"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                            lineNumber: 402,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                    lineNumber: 395,
                                                    columnNumber: 25
                                                }, this),
                                                Array.isArray(d.dining) && d.dining.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-2 rounded bg-white/60 p-2 text-[12px] text-zinc-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-medium text-zinc-800",
                                                            children: "餐饮"
                                                        }, void 0, false, {
                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                            lineNumber: 408,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                            className: "mt-1 space-y-1",
                                                            children: d.dining.map((r, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "flex items-center justify-between cursor-pointer hover:bg-zinc-100 px-1 rounded",
                                                                    onClick: ()=>{
                                                                        if (r.location && typeof r.location.lat === "number" && typeof r.location.lng === "number") {
                                                                            handleLocatePoint(r.location.lat, r.location.lng, r.name);
                                                                        } else {
                                                                            locateByPlaceName(r.name);
                                                                        }
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-zinc-800",
                                                                                    children: r.name
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                                    lineNumber: 423,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                r.cuisine ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "ml-2 text-zinc-500",
                                                                                    children: r.cuisine
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                                    lineNumber: 424,
                                                                                    columnNumber: 48
                                                                                }, this) : null,
                                                                                Array.isArray(r.priceRange) && r.priceRange.length === 2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "ml-2 text-zinc-600",
                                                                                    children: [
                                                                                        "￥",
                                                                                        r.priceRange[0],
                                                                                        "–",
                                                                                        r.priceRange[1]
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                                    lineNumber: 426,
                                                                                    columnNumber: 37
                                                                                }, this) : null,
                                                                                typeof r.rating === "number" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "ml-2 text-amber-600",
                                                                                    children: [
                                                                                        "评分 ",
                                                                                        r.rating
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                                    lineNumber: 429,
                                                                                    columnNumber: 37
                                                                                }, this) : null
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                            lineNumber: 422,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        r.location && typeof r.location.lat === "number" && typeof r.location.lng === "number" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            className: "rounded bg-blue-500 px-2 py-0.5 text-white",
                                                                            onClick: (e)=>{
                                                                                e.stopPropagation();
                                                                                handleLocatePoint(r.location.lat, r.location.lng, r.name);
                                                                            },
                                                                            children: "定位"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                            lineNumber: 433,
                                                                            columnNumber: 35
                                                                        }, this) : null
                                                                    ]
                                                                }, `${d.date}-dining-${idx}`, true, {
                                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                    lineNumber: 411,
                                                                    columnNumber: 31
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                            lineNumber: 409,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                    lineNumber: 407,
                                                    columnNumber: 25
                                                }, this) : null,
                                                Array.isArray(d.lodging) && d.lodging.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-2 rounded bg-white/60 p-2 text-[12px] text-zinc-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-medium text-zinc-800",
                                                            children: "住宿"
                                                        }, void 0, false, {
                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                            lineNumber: 443,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                            className: "mt-1 space-y-1",
                                                            children: d.lodging.map((h, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "flex items-center justify-between cursor-pointer hover:bg-zinc-100 px-1 rounded",
                                                                    onClick: ()=>{
                                                                        if (h.location && typeof h.location.lat === "number" && typeof h.location.lng === "number") {
                                                                            handleLocatePoint(h.location.lat, h.location.lng, h.name);
                                                                        } else {
                                                                            locateByPlaceName(h.name);
                                                                        }
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-zinc-800",
                                                                                    children: h.name
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                                    lineNumber: 458,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                h.area ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "ml-2 text-zinc-500",
                                                                                    children: h.area
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                                    lineNumber: 459,
                                                                                    columnNumber: 45
                                                                                }, this) : null,
                                                                                typeof h.price === "number" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "ml-2 text-zinc-600",
                                                                                    children: [
                                                                                        "￥",
                                                                                        h.price
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                                    lineNumber: 460,
                                                                                    columnNumber: 66
                                                                                }, this) : null,
                                                                                typeof h.rating === "number" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "ml-2 text-amber-600",
                                                                                    children: [
                                                                                        "评分 ",
                                                                                        h.rating
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                                    lineNumber: 461,
                                                                                    columnNumber: 67
                                                                                }, this) : null,
                                                                                Array.isArray(h.amenities) && h.amenities.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "ml-2 text-zinc-500",
                                                                                    children: h.amenities.join("、")
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                                    lineNumber: 463,
                                                                                    columnNumber: 37
                                                                                }, this) : null
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                            lineNumber: 457,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        h.location && typeof h.location.lat === "number" && typeof h.location.lng === "number" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            className: "rounded bg-blue-500 px-2 py-0.5 text-white",
                                                                            onClick: (e)=>{
                                                                                e.stopPropagation();
                                                                                handleLocatePoint(h.location.lat, h.location.lng, h.name);
                                                                            },
                                                                            children: "定位"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                            lineNumber: 467,
                                                                            columnNumber: 35
                                                                        }, this) : null
                                                                    ]
                                                                }, `${d.date}-lodging-${idx}`, true, {
                                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                    lineNumber: 446,
                                                                    columnNumber: 31
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                            lineNumber: 444,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                    lineNumber: 442,
                                                    columnNumber: 25
                                                }, this) : null,
                                                Array.isArray(d.attractions) && d.attractions.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-2 rounded bg-white/60 p-2 text-[12px] text-zinc-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-medium text-zinc-800",
                                                            children: "景点"
                                                        }, void 0, false, {
                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                            lineNumber: 477,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                            className: "mt-1 space-y-1",
                                                            children: d.attractions.map((a, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "cursor-pointer hover:bg-zinc-100 px-1 rounded",
                                                                    onClick: ()=>{
                                                                        if (a.location && typeof a.location.lat === "number" && typeof a.location.lng === "number") {
                                                                            handleLocatePoint(a.location.lat, a.location.lng, a.name);
                                                                        } else {
                                                                            locateByPlaceName(a.name);
                                                                        }
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-zinc-800",
                                                                            children: a.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                            lineNumber: 491,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        typeof a.ticket === "number" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "ml-2 text-zinc-600",
                                                                            children: [
                                                                                "门票 ￥",
                                                                                a.ticket
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                            lineNumber: 492,
                                                                            columnNumber: 65
                                                                        }, this) : a.ticket ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "ml-2 text-zinc-600",
                                                                            children: [
                                                                                "门票 ",
                                                                                String(a.ticket)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                            lineNumber: 492,
                                                                            columnNumber: 137
                                                                        }, this) : null,
                                                                        a.best_time ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "ml-2 text-zinc-500",
                                                                            children: [
                                                                                "最佳时段 ",
                                                                                a.best_time
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                            lineNumber: 493,
                                                                            columnNumber: 48
                                                                        }, this) : null,
                                                                        a.tips ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "ml-2 text-zinc-500",
                                                                            children: a.tips
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                            lineNumber: 494,
                                                                            columnNumber: 43
                                                                        }, this) : null,
                                                                        Array.isArray(a.photo_spots) && a.photo_spots.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mt-0.5 text-zinc-600",
                                                                            children: [
                                                                                "拍照点：",
                                                                                a.photo_spots.join("、")
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                            lineNumber: 496,
                                                                            columnNumber: 35
                                                                        }, this) : null
                                                                    ]
                                                                }, `${d.date}-attraction-${idx}`, true, {
                                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                                    lineNumber: 480,
                                                                    columnNumber: 31
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                            lineNumber: 478,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                    lineNumber: 476,
                                                    columnNumber: 25
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                            lineNumber: 379,
                                            columnNumber: 21
                                        }, this);
                                    })()
                                }, void 0, false, {
                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                    lineNumber: 355,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                lineNumber: 354,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                        lineNumber: 315,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                lineNumber: 304,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: "border px-2 py-1",
                        placeholder: "起点",
                        value: origin,
                        onChange: (e)=>setOrigin(e.target.value)
                    }, void 0, false, {
                        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                        lineNumber: 512,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: "border px-2 py-1",
                        placeholder: "终点",
                        value: destination,
                        onChange: (e)=>setDestination(e.target.value)
                    }, void 0, false, {
                        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                        lineNumber: 513,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        className: "border px-2 py-1",
                        value: type,
                        onChange: (e)=>setType(e.target.value),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "driving",
                                children: "驾车"
                            }, void 0, false, {
                                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                lineNumber: 515,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "walking",
                                children: "步行"
                            }, void 0, false, {
                                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                lineNumber: 516,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "bicycling",
                                children: "骑行"
                            }, void 0, false, {
                                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                lineNumber: 517,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                        lineNumber: 514,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "bg-blue-600 text-white px-3 py-1 rounded",
                        onClick: handleQueryRoute,
                        children: "查询路线"
                    }, void 0, false, {
                        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                        lineNumber: 519,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$components$2f$VoiceButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onTranscribe: handleTranscribe
                    }, void 0, false, {
                        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                        lineNumber: 520,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                lineNumber: 511,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-600",
                children: String(error?.message)
            }, void 0, false, {
                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                lineNumber: 522,
                columnNumber: 17
            }, this),
            isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: "加载中..."
            }, void 0, false, {
                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                lineNumber: 523,
                columnNumber: 21
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "地图与路线",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative h-[480px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$components$2f$MapView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            center: center,
                            zoom: 12,
                            routePath: routePath,
                            markers: markersToRender
                        }, void 0, false, {
                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                            lineNumber: 526,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                        lineNumber: 525,
                        columnNumber: 9
                    }, this),
                    data && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 text-sm text-gray-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    "距离：",
                                    Math.round(data.distance),
                                    " 米"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                lineNumber: 530,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    "预计耗时：",
                                    Math.round(data.duration / 60),
                                    " 分钟"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                lineNumber: 531,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                        lineNumber: 529,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                lineNumber: 524,
                columnNumber: 7
            }, this),
            showPrefs && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/30",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-2xl rounded-md border border-zinc-200 bg-white p-4 shadow-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm font-medium",
                                    children: "偏好设置与重新生成"
                                }, void 0, false, {
                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                    lineNumber: 539,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "text-zinc-500 hover:text-zinc-700",
                                    onClick: ()=>setShowPrefs(false),
                                    children: "关闭"
                                }, void 0, false, {
                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                    lineNumber: 540,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                            lineNumber: 538,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    className: "border px-2 py-1 rounded",
                                    placeholder: "目的地",
                                    value: destInput,
                                    onChange: (e)=>setDestInput(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                    lineNumber: 543,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "border px-2 py-1 rounded",
                                            type: "date",
                                            value: startInput,
                                            onChange: (e)=>setStartInput(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                            lineNumber: 545,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "border px-2 py-1 rounded",
                                            type: "date",
                                            value: endInput,
                                            onChange: (e)=>setEndInput(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                            lineNumber: 546,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                    lineNumber: 544,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-1 sm:col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-zinc-600 mb-1",
                                            children: "行程节奏"
                                        }, void 0, false, {
                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                            lineNumber: 549,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                "relaxed",
                                                "standard",
                                                "intense"
                                            ].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setPace(p),
                                                    className: [
                                                        "rounded border px-2 py-1 text-xs",
                                                        pace === p ? "border-blue-500 bg-blue-50 text-blue-700" : "border-zinc-300"
                                                    ].join(" "),
                                                    children: p === "relaxed" ? "悠闲" : p === "standard" ? "标准" : "紧凑"
                                                }, p, false, {
                                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                                    lineNumber: 552,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                            lineNumber: 550,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                    lineNumber: 548,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-1 sm:col-span-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "border px-2 py-1 rounded w-full",
                                        placeholder: "兴趣偏好（逗号分隔，如：美食, 博物馆, 徒步）",
                                        value: interestsText,
                                        onChange: (e)=>setInterestsText(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                        lineNumber: 557,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                    lineNumber: 556,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-1 sm:col-span-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "border px-2 py-1 rounded w-full",
                                        type: "number",
                                        min: "0",
                                        placeholder: "总预算（元）",
                                        value: budgetInput,
                                        onChange: (e)=>setBudgetInput(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                        lineNumber: 560,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                    lineNumber: 559,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                            lineNumber: 542,
                            columnNumber: 13
                        }, this),
                        genError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700",
                            children: genError
                        }, void 0, false, {
                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                            lineNumber: 563,
                            columnNumber: 26
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 flex justify-end gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "border px-3 py-1 rounded",
                                    onClick: ()=>setShowPrefs(false),
                                    children: "取消"
                                }, void 0, false, {
                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                    lineNumber: 565,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50",
                                    onClick: async ()=>{
                                        setGenerating(true);
                                        setGenError(null);
                                        try {
                                            const interests = interestsText.split(/[,，\s]+/).map((s)=>s.trim()).filter(Boolean);
                                            const body = {
                                                destination: destInput || destination,
                                                start_date: startInput || plan?.start_date || "",
                                                end_date: endInput || plan?.end_date || "",
                                                preferences: {
                                                    pace,
                                                    ...interests.length ? {
                                                        interests
                                                    } : {},
                                                    ...budgetInput.trim() ? {
                                                        budgetTotal: Number(budgetInput)
                                                    } : {}
                                                }
                                            };
                                            const res = await fetch("/api/plan/create", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify(body)
                                            });
                                            if (!res.ok) {
                                                const msg = await res.text().catch(()=>"生成失败");
                                                throw new Error(msg || "生成失败");
                                            }
                                            const data = await res.json();
                                            setPlan(data);
                                            try {
                                                localStorage.setItem("lastPlan", JSON.stringify(data));
                                                localStorage.setItem("lastPrefs", JSON.stringify({
                                                    pace,
                                                    interests,
                                                    ...budgetInput.trim() ? {
                                                        budgetTotal: Number(budgetInput)
                                                    } : {}
                                                }));
                                            } catch  {}
                                            setShowPrefs(false);
                                        } catch (e) {
                                            setGenError(e?.message || "生成失败");
                                        } finally{
                                            setGenerating(false);
                                        }
                                    },
                                    disabled: generating,
                                    children: generating ? "生成中..." : "重新生成"
                                }, void 0, false, {
                                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                                    lineNumber: 566,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                            lineNumber: 564,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                    lineNumber: 537,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
                lineNumber: 536,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/AI-Travel/web/src/app/plan/page.tsx",
        lineNumber: 302,
        columnNumber: 5
    }, this);
}
_s1(PlanPage, "+5smO0H9QgkdO1BzVk5etLCQioE=", false, function() {
    return [
        useRouteQuery
    ];
});
_c = PlanPage;
var _c;
__turbopack_context__.k.register(_c, "PlanPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=AI-Travel_web_src_5d9e747c._.js.map