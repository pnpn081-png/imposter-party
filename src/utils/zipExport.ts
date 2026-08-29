import JSZip from 'jszip';
import { ANDROID_CODEBASE } from '../data/androidCodebase';
import { ANDROID_SCREENS_CODEBASE } from '../data/androidScreens';

export async function generateAndroidProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // 1. Root settings & gradle files
  zip.file('settings.gradle.kts', `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "ImposterParty"
include(":app")
`);

  zip.file('build.gradle.kts', `// Top-level build file
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.serialization) apply false
    alias(libs.plugins.hilt.android) apply false
    alias(libs.plugins.ksp) apply false
}
`);

  zip.file('gradle.properties', `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
kotlin.code.style=official
android.nonTransitiveRClass=true
`);

  zip.file('gradle/libs.versions.toml', `[versions]
agp = "8.3.0"
kotlin = "1.9.22"
coreKtx = "1.12.0"
lifecycleRuntimeKtx = "2.7.0"
activityCompose = "1.8.2"
composeBom = "2024.02.01"
navigationCompose = "2.7.7"
hilt = "2.50"
hiltNavigationCompose = "1.2.0"
coroutines = "1.8.0"
serialization = "1.6.3"
ksp = "1.9.22-1.0.17"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-compose-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-compose-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-compose-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-compose-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-compose-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
hilt-android = { group = "com.google.dagger", name = "hilt-android", version.ref = "hilt" }
hilt-compiler = { group = "com.google.dagger", name = "hilt-android-compiler", version.ref = "hilt" }
androidx-hilt-navigation-compose = { group = "androidx.hilt", name = "hilt-navigation-compose", version.ref = "hiltNavigationCompose" }
kotlinx-coroutines-core = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-core", version.ref = "coroutines" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }
kotlinx-serialization-json = { group = "org.jetbrains.kotlinx", name = "kotlinx-serialization-json", version.ref = "serialization" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
hilt-android = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
`);

  // 2. Add Android resources
  zip.file('app/src/main/res/values/strings.xml', `<resources>
    <string name="app_name">Imposter Party</string>
</resources>`);

  zip.file('app/src/main/res/values/themes.xml', `<resources>
    <style name="Theme.ImposterParty" parent="android:Theme.Material.NoActionBar">
        <item name="android:statusBarColor">#0D1117</item>
        <item name="android:navigationBarColor">#0D1117</item>
    </style>
</resources>`);

  // 3. Add all Kotlin & code files
  const allFiles = [...ANDROID_CODEBASE, ...ANDROID_SCREENS_CODEBASE];
  for (const file of allFiles) {
    zip.file(file.path, file.content);
  }

  // 4. Add comprehensive README.md
  zip.file('README.md', `# Imposter Party - Offline Multiplayer Game for Android
Built with **Kotlin**, **Jetpack Compose (Material 3)**, **Hilt DI**, and **Android Network Service Discovery (NSD) / Sockets**.

## Features
- **Pass & Play (Single Phone):** 3-12 players, customizable categories, secret hold-to-reveal gesture with anti-peeking instant auto-hide, integrated discussion timer & elimination voting.
- **Local Wi-Fi / Hotspot Mode (Multi-Phone):** 100% offline multi-device play using local Wi-Fi or portable hotspot. Automatic discovery via Android NSD \`_imposterparty._tcp.\` and direct TCP socket synchronization.

## How to Open in Android Studio
1. Unzip the project folder.
2. Open Android Studio (Hedgehog 2023.1.1 or Ladybug 2024.2+ recommended).
3. Select **File -> Open...** and choose the unzipped \`ImposterParty\` directory.
4. Let Gradle sync and download dependencies.
5. Click **Run 'app'** on an Android emulator or physical device.

## Testing Multi-Phone Offline Mode
1. Ensure both Android phones are connected to the **same Wi-Fi router** OR have **one phone turn on Portable Hotspot** and the other phone connect to it.
2. Phone A: Tap **Host Local Room**.
3. Phone B: Tap **Join Room** (NSD will auto-discover the host, or enter IP manually).
4. Tap Start Game to distribute confidential cards to all screens!
`);

  return await zip.generateAsync({ type: 'blob' });
}
