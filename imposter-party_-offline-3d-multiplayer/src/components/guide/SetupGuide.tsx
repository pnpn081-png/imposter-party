import React from 'react';
import {
  BookOpen, Terminal, CheckCircle2, ShieldAlert, Wifi, Cpu, Layers,
  Code2, ExternalLink, HelpCircle, Flame, Sparkles
} from 'lucide-react';

export const SetupGuide: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto text-slate-200">
      {/* Header */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Android Studio Architecture & Setup Manual</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
          Imposter Party: Complete Implementation Guide
        </h1>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Step-by-step instructions to compile and deploy the offline multiplayer Kotlin & Jetpack Compose application with Hilt DI, NSD Auto-Discovery, and Touch Gestures.
        </p>
      </div>

      {/* 1. Android Studio Quick Start */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-sm">
            1
          </div>
          <h2 className="text-lg font-bold text-slate-100">Android Studio Setup & Import</h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-300 pl-11">
          <div className="p-4 rounded-2xl bg-[#161B22] border border-slate-800 space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Prerequisites:</strong> Android Studio Hedgehog (2023.1.1+) or Ladybug (2024.2+), JDK 17, and an Android device or emulator with API Level 26+ (Android 8.0+).
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Download Project:</strong> Click the <strong>"Download Android Studio Project (.ZIP)"</strong> button in the Code Explorer tab above.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Open in Android Studio:</strong> Select <strong>File → Open...</strong> and choose the unzipped <code className="text-cyan-300 font-mono">ImposterParty</code> root directory.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Sync Gradle:</strong> Android Studio will automatically run Gradle Sync to resolve Jetpack Compose, Material 3, Hilt, and Kotlinx Serialization dependencies.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hold-to-Reveal Gesture Mechanic */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-sm">
            2
          </div>
          <h2 className="text-lg font-bold text-slate-100">Hold-to-Reveal Gesture Implementation</h2>
        </div>

        <div className="pl-11 space-y-3 text-xs sm:text-sm text-slate-300">
          <p className="leading-relaxed text-slate-400">
            To prevent neighboring players from peeking at secret roles, the card uses a low-level <code className="text-cyan-300 font-mono">pointerInput</code> gesture in Jetpack Compose:
          </p>

          <div className="p-4 rounded-2xl bg-[#0D1117] border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300">
            <span className="text-purple-400">Modifier</span>.<span className="text-cyan-400">pointerInput</span>(Unit) &#123;<br />
            &nbsp;&nbsp;<span className="text-cyan-400">awaitEachGesture</span> &#123;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">// 1. Instant touch down: Show card & trigger tactile haptic rumble</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-rose-400">val</span> down = <span className="text-cyan-400">awaitFirstDown</span>(requireUnconsumed = <span className="text-orange-400">false</span>)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;isHolding = <span className="text-orange-400">true</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;vibrator?.<span className="text-cyan-400">vibrate</span>(VibrationEffect.createOneShot(50, VibrationEffect.DEFAULT_AMPLITUDE))<br />
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">// 2. Touch release or finger drag cancellation: IMMEDIATELY hide secret</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-rose-400">val</span> up = <span className="text-cyan-400">waitForUpOrCancellation</span>()<br />
            &nbsp;&nbsp;&nbsp;&nbsp;isHolding = <span className="text-orange-400">false</span><br />
            &nbsp;&nbsp;&#125;<br />
            &#125;
          </div>
        </div>
      </section>

      {/* 3. Offline NSD & Socket Server Architecture */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-sm">
            3
          </div>
          <h2 className="text-lg font-bold text-slate-100">Local Wi-Fi & Hotspot NSD Networking</h2>
        </div>

        <div className="pl-11 space-y-3 text-xs sm:text-sm text-slate-300">
          <p className="leading-relaxed text-slate-400">
            The multi-phone mode operates <strong>100% offline</strong> with zero cloud servers. It supports two physical topologies:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#161B22] border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase mb-2">
                <Wifi className="w-4 h-4" />
                Topology A: Shared Wi-Fi
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                All phones are connected to the same local router (even without active internet access). Multicast DNS broadcast enables instant auto-pairing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#161B22] border border-slate-800">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase mb-2">
                <Flame className="w-4 h-4" />
                Topology B: Portable Hotspot
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                One phone enables Android's <em>Portable Wi-Fi Hotspot</em>. Other phones connect directly to this hotspot (e.g. at a campsite, plane, or subway).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#161B22] border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">NSD Registration Code Snippet</h4>
            <div className="font-mono text-xs text-slate-300 bg-[#0D1117] p-3 rounded-xl">
              val serviceInfo = NsdServiceInfo().apply &#123;<br />
              &nbsp;&nbsp;serviceName = "ImposterPartyHost"<br />
              &nbsp;&nbsp;serviceType = "_imposterparty._tcp."<br />
              &nbsp;&nbsp;port = 8888<br />
              &#125;<br />
              nsdManager.registerService(serviceInfo, NsdManager.PROTOCOL_DNS_SD, listener)
            </div>
          </div>
        </div>
      </section>

      {/* 4. AndroidManifest Permissions Breakdown */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-sm">
            4
          </div>
          <h2 className="text-lg font-bold text-slate-100">AndroidManifest.xml Permissions</h2>
        </div>

        <div className="pl-11 space-y-2 text-xs sm:text-sm text-slate-300">
          <div className="p-4 rounded-2xl bg-[#161B22] border border-slate-800 space-y-2 font-mono text-xs">
            <div className="text-slate-400">
              <span className="text-cyan-400">&lt;uses-permission</span> android:name="android.permission.INTERNET" /&gt;
              <span className="text-slate-600 block text-[11px] font-sans">Enables local TCP sockets between devices</span>
            </div>
            <div className="text-slate-400">
              <span className="text-cyan-400">&lt;uses-permission</span> android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" /&gt;
              <span className="text-slate-600 block text-[11px] font-sans">Allows Android NSD mDNS discovery packets</span>
            </div>
            <div className="text-slate-400">
              <span className="text-cyan-400">&lt;uses-permission</span> android:name="android.permission.NEARBY_WIFI_DEVICES" /&gt;
              <span className="text-slate-600 block text-[11px] font-sans">Required for Android 13+ (API 33) without requiring location access</span>
            </div>
            <div className="text-slate-400">
              <span className="text-cyan-400">&lt;uses-permission</span> android:name="android.permission.VIBRATE" /&gt;
              <span className="text-slate-600 block text-[11px] font-sans">Tactile biometric feedback during card hold</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
