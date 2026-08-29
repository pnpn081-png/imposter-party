export interface CodeFile {
  path: string;
  name: string;
  language: string;
  description: string;
  category: 'manifest' | 'gradle' | 'di' | 'model' | 'network' | 'repository' | 'viewmodel' | 'components' | 'screens' | 'theme';
  content: string;
}

export const ANDROID_CODEBASE: CodeFile[] = [
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    language: 'xml',
    description: 'Permissions for local Wi-Fi Sockets, Multicast NSD discovery, and Hilt setup',
    category: 'manifest',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.imposter.party">

    <!-- Permissions for Local Wi-Fi Sockets and Network Service Discovery (NSD) -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" />
    <uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <!-- Required for Android 13+ to discover local devices over Wi-Fi without location -->
    <uses-permission 
        android:name="android.permission.NEARBY_WIFI_DEVICES"
        android:usesPermissionFlags="neverForLocation"
        tools:targetApi="tiramisu" />

    <application
        android:name=".ImposterPartyApp"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ImposterParty"
        android:usesCleartextTraffic="true"
        tools:targetApi="34">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.ImposterParty">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
  },
  {
    path: 'app/build.gradle.kts',
    name: 'build.gradle.kts (App)',
    language: 'kotlin',
    description: 'App-level Gradle dependencies: Jetpack Compose, Material 3, Hilt, Coroutines, Kotlinx Serialization',
    category: 'gradle',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.hilt.android)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.imposter.party"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.imposter.party"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    // AndroidX Core & Lifecycle
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)

    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
    implementation(libs.androidx.navigation.compose)

    // Hilt Dependency Injection
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    implementation(libs.androidx.hilt.navigation.compose)

    // Kotlin Coroutines & JSON Serialization
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.kotlinx.serialization.json)
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/ImposterPartyApp.kt',
    name: 'ImposterPartyApp.kt',
    language: 'kotlin',
    description: 'Hilt Application class initializing multicasters and DI container',
    category: 'di',
    content: `package com.imposter.party

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class ImposterPartyApp : Application() {
    override fun onCreate() {
        super.onCreate()
    }
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/MainActivity.kt',
    name: 'MainActivity.kt',
    language: 'kotlin',
    description: 'Main Compose entry point configuring NavHost and edge-to-edge dark theme',
    category: 'screens',
    content: `package com.imposter.party

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.imposter.party.ui.screens.DiscussionScreen
import com.imposter.party.ui.screens.HomeScreen
import com.imposter.party.ui.screens.NetworkGameScreen
import com.imposter.party.ui.screens.NetworkLobbyScreen
import com.imposter.party.ui.screens.PassPlayRevealScreen
import com.imposter.party.ui.screens.PassPlaySetupScreen
import com.imposter.party.ui.screens.ResultsScreen
import com.imposter.party.ui.screens.VotingScreen
import com.imposter.party.ui.theme.ImposterPartyTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ImposterPartyTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()

                    NavHost(
                        navController = navController,
                        startDestination = "home"
                    ) {
                        composable("home") {
                            HomeScreen(
                                onPassPlaySelected = { navController.navigate("pass_play_setup") },
                                onHostWifiSelected = { navController.navigate("network_lobby/host") },
                                onJoinWifiSelected = { navController.navigate("network_lobby/join") }
                            )
                        }
                        composable("pass_play_setup") {
                            PassPlaySetupScreen(
                                onStartGame = { navController.navigate("pass_play_reveal") },
                                onBack = { navController.popBackStack() }
                            )
                        }
                        composable("pass_play_reveal") {
                            PassPlayRevealScreen(
                                onAllCardsRevealed = { navController.navigate("discussion") },
                                onQuit = { navController.navigate("home") { popUpTo(0) } }
                            )
                        }
                        composable("discussion") {
                            DiscussionScreen(
                                onStartVoting = { navController.navigate("voting") },
                                onCancel = { navController.navigate("home") { popUpTo(0) } }
                            )
                        }
                        composable("voting") {
                            VotingScreen(
                                onVotingFinished = { navController.navigate("results") }
                            )
                        }
                        composable("results") {
                            ResultsScreen(
                                onPlayAgain = { navController.navigate("pass_play_setup") { popUpTo("home") } },
                                onHome = { navController.navigate("home") { popUpTo(0) } }
                            )
                        }
                        composable("network_lobby/{role}") { backStackEntry ->
                            val isHost = backStackEntry.arguments?.getString("role") == "host"
                            NetworkLobbyScreen(
                                isHost = isHost,
                                onGameStart = { navController.navigate("network_game") },
                                onBack = { navController.popBackStack() }
                            )
                        }
                        composable("network_game") {
                            NetworkGameScreen(
                                onGameEnd = { navController.navigate("home") { popUpTo(0) } }
                            )
                        }
                    }
                }
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/data/model/GameModels.kt',
    name: 'GameModels.kt',
    language: 'kotlin',
    description: 'Data classes & Enums for Role, Player, Category, GameState, and NetworkPackets',
    category: 'model',
    content: `package com.imposter.party.data.model

import kotlinx.serialization.Serializable

@Serializable
enum class Role {
    CREWMATE,
    IMPOSTER
}

@Serializable
enum class GameMode {
    PASS_AND_PLAY,
    LOCAL_WIFI_HOST,
    LOCAL_WIFI_CLIENT
}

@Serializable
enum class GamePhase {
    SETUP,
    PASS_PHONE,
    HOLD_REVEAL,
    DISCUSSION,
    VOTING,
    RESULTS
}

@Serializable
data class Player(
    val id: String,
    val name: String,
    val role: Role = Role.CREWMATE,
    val secretWord: String = "",
    val isReady: Boolean = false,
    val hasVoted: Boolean = false,
    val votedForId: String? = null,
    val isHost: Boolean = false,
    val avatarIndex: Int = 0
)

@Serializable
data class Category(
    val id: String,
    val name: String,
    val description: String,
    val words: List<String>
)

@Serializable
data class GameSettings(
    val playerCount: Int = 4,
    val imposterCount: Int = 1,
    val categoryId: String = "cyberpunk",
    val discussionTimeSeconds: Int = 180,
    val showRoleHints: Boolean = true
)

@Serializable
data class GameState(
    val phase: GamePhase = GamePhase.SETUP,
    val mode: GameMode = GameMode.PASS_AND_PLAY,
    val players: List<Player> = emptyList(),
    val currentPlayerIndex: Int = 0,
    val selectedCategory: Category? = null,
    val secretWord: String = "",
    val timerSecondsLeft: Int = 180,
    val isTimerRunning: Boolean = false,
    val eliminatedPlayerId: String? = null,
    val winner: Role? = null
)

@Serializable
data class NetworkPacket(
    val type: PacketType,
    val senderId: String,
    val payloadJson: String,
    val timestamp: Long = System.currentTimeMillis()
)

@Serializable
enum class PacketType {
    JOIN_REQUEST,
    LOBBY_STATE,
    START_GAME,
    ASSIGN_SECRET,
    TIMER_SYNC,
    SUBMIT_VOTE,
    GAME_RESULTS
}

@Serializable
data class RoleAssignmentPayload(
    val playerId: String,
    val role: Role,
    val secretWord: String,
    val categoryName: String
)`
  },
  {
    path: 'app/src/main/java/com/imposter/party/data/repository/GameRepository.kt',
    name: 'GameRepository.kt',
    language: 'kotlin',
    description: 'Game logic engine: Word list management, role assignment, and vote tallying',
    category: 'repository',
    content: `package com.imposter.party.data.repository

import com.imposter.party.data.model.Category
import com.imposter.party.data.model.GameSettings
import com.imposter.party.data.model.GameState
import com.imposter.party.data.model.Player
import com.imposter.party.data.model.Role
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.random.Random

@Singleton
class GameRepository @Inject constructor() {

    val categories = listOf(
        Category(
            id = "cyberpunk",
            name = "Cyberpunk & Tech",
            description = "Futuristic gadgets, neon cities, and hacker tools",
            words = listOf(
                "Neural Implant", "Quantum Computer", "Cybernetic Arm", "Hologram", "AI Core",
                "Data Matrix", "Neon Billboard", "Drone Swarm", "Laser Pistol", "Augmented Reality",
                "Android Clone", "Nanobots", "Dark Web Node", "Exoskeleton", "Biochip"
            )
        ),
        Category(
            id = "secret_agent",
            name = "Secret Agents & Spies",
            description = "Espionage, stealth gear, and covert operations",
            words = listOf(
                "Silencer", "Fake Passport", "Wiretap", "Briefcase Lock", "Smoke Bomb",
                "Disguise Mask", "Laser Watch", "Microfilm", "Safehouse", "Poison Dart",
                "Satellite Phone", "Decoder Ring", "Trenchcoat", "Fingerprint Scanner", "Night Vision"
            )
        ),
        Category(
            id = "food_dining",
            name = "Food & Culinary",
            description = "Delicious dishes, gourmet equipment, and desserts",
            words = listOf(
                "Sushi Roll", "Woodfired Pizza", "Cheeseburger", "Ice Cream Sundae", "Spaghetti Carbonara",
                "Croissant", "Taco al Pastor", "French Fries", "Espresso Shot", "Ramen Bowl",
                "Chocolate Fondue", "Pancakes", "Guacamole", "Lobster Tail", "Apple Pie"
            )
        ),
        Category(
            id = "space_scifi",
            name = "Space & Cosmos",
            description = "Planets, spacecraft, constellations, and mysteries",
            words = listOf(
                "Black Hole", "Space Shuttle", "Mars Rover", "Asteroid Belt", "Supernova",
                "Space Station", "Alien Spaceship", "Moon Lander", "Cosmic Nebula", "Solar Flare",
                "Astronaut Helmet", "Wormhole", "Telescope", "Zero Gravity", "Satellite Orbit"
            )
        ),
        Category(
            id = "animals_nature",
            name = "Wild Animals",
            description = "Creatures of the savanna, ocean, jungles, and skies",
            words = listOf(
                "Cheetah", "Great White Shark", "Bald Eagle", "Chameleon", "Giant Panda",
                "King Cobra", "Humpback Whale", "Arctic Wolf", "Kangaroo", "Grizzly Bear",
                "Octopus", "Penguin", "Flamingo", "Gorilla", "Electric Eel"
            )
        )
    )

    fun initializePassPlayGame(
        playerNames: List<String>,
        settings: GameSettings
    ): GameState {
        val category = categories.find { it.id == settings.categoryId } ?: categories.first()
        val secretWord = category.words.random()

        val count = playerNames.size.coerceIn(3, 12)
        val imposterCount = settings.imposterCount.coerceIn(1, if (count >= 7) 2 else 1)

        // Select random imposter indices
        val imposterIndices = mutableSetOf<Int>()
        while (imposterIndices.size < imposterCount) {
            imposterIndices.add(Random.nextInt(count))
        }

        val players = playerNames.take(count).mapIndexed { index, name ->
            val isImposter = imposterIndices.contains(index)
            Player(
                id = "player_$index",
                name = name.ifBlank { "Player \${index + 1}" },
                role = if (isImposter) Role.IMPOSTER else Role.CREWMATE,
                secretWord = if (isImposter) "" else secretWord,
                avatarIndex = index % 8
            )
        }

        return GameState(
            phase = com.imposter.party.data.model.GamePhase.PASS_PHONE,
            mode = com.imposter.party.data.model.GameMode.PASS_AND_PLAY,
            players = players,
            currentPlayerIndex = 0,
            selectedCategory = category,
            secretWord = secretWord,
            timerSecondsLeft = settings.discussionTimeSeconds,
            isTimerRunning = false
        )
    }

    fun tallyVotes(players: List<Player>): Pair<Player?, Role> {
        val voteCounts = mutableMapOf<String, Int>()
        players.forEach { player ->
            player.votedForId?.let { targetId ->
                voteCounts[targetId] = (voteCounts[targetId] ?: 0) + 1
            }
        }

        val topVotedEntry = voteCounts.maxByOrNull { it.value }
        val eliminatedPlayer = players.find { it.id == topVotedEntry?.key }

        val imposters = players.filter { it.role == Role.IMPOSTER }
        val winner = if (eliminatedPlayer != null && eliminatedPlayer.role == Role.IMPOSTER) {
            Role.CREWMATE
        } else {
            Role.IMPOSTER
        }

        return Pair(eliminatedPlayer, winner)
    }
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/data/network/NsdHelper.kt',
    name: 'NsdHelper.kt',
    language: 'kotlin',
    description: 'Android Network Service Discovery helper for zero-config offline Wi-Fi host registration and discovery',
    category: 'network',
    content: `package com.imposter.party.data.network

import android.content.Context
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.util.Log
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.net.InetAddress
import javax.inject.Inject
import javax.inject.Singleton

data class DiscoveredService(
    val serviceName: String,
    val host: InetAddress?,
    val port: Int
)

@Singleton
class NsdHelper @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val nsdManager: NsdManager =
        context.getSystemService(Context.NSD_SERVICE) as NsdManager

    private val SERVICE_TYPE = "_imposterparty._tcp."
    private val TAG = "NsdHelper"

    private var registrationListener: NsdManager.RegistrationListener? = null
    private var discoveryListener: NsdManager.DiscoveryListener? = null

    private val _discoveredHosts = MutableStateFlow<List<DiscoveredService>>(emptyList())
    val discoveredHosts: StateFlow<List<DiscoveredService>> = _discoveredHosts.asStateFlow()

    fun registerService(port: Int, roomName: String = "ImposterPartyHost") {
        val serviceInfo = NsdServiceInfo().apply {
            serviceName = roomName
            serviceType = SERVICE_TYPE
            setPort(port)
        }

        registrationListener = object : NsdManager.RegistrationListener {
            override fun onServiceRegistered(NsdServiceInfo: NsdServiceInfo) {
                Log.d(TAG, "Service registered successfully: \${NsdServiceInfo.serviceName}")
            }
            override fun onRegistrationFailed(serviceInfo: NsdServiceInfo, errorCode: Int) {
                Log.e(TAG, "Registration failed with code: $errorCode")
            }
            override fun onServiceUnregistered(arg0: NsdServiceInfo) {
                Log.d(TAG, "Service unregistered")
            }
            override fun onUnregistrationFailed(serviceInfo: NsdServiceInfo, errorCode: Int) {
                Log.e(TAG, "Unregistration failed with code: $errorCode")
            }
        }

        try {
            nsdManager.registerService(serviceInfo, NsdManager.PROTOCOL_DNS_SD, registrationListener)
        } catch (e: Exception) {
            Log.e(TAG, "Error registering NSD service", e)
        }
    }

    fun startDiscovery() {
        _discoveredHosts.value = emptyList()
        discoveryListener = object : NsdManager.DiscoveryListener {
            override fun onDiscoveryStarted(regType: String) {
                Log.d(TAG, "Service discovery started")
            }

            override fun onServiceFound(service: NsdServiceInfo) {
                Log.d(TAG, "Service discovery success: $service")
                if (service.serviceType == SERVICE_TYPE || service.serviceType.contains("imposterparty")) {
                    resolveService(service)
                }
            }

            override fun onServiceLost(service: NsdServiceInfo) {
                Log.d(TAG, "Service lost: $service")
                _discoveredHosts.value = _discoveredHosts.value.filter { it.serviceName != service.serviceName }
            }

            override fun onDiscoveryStopped(serviceType: String) {
                Log.d(TAG, "Discovery stopped: $serviceType")
            }

            override fun onStartDiscoveryFailed(serviceType: String, errorCode: Int) {
                Log.e(TAG, "Discovery start failed: $errorCode")
                stopDiscovery()
            }

            override fun onStopDiscoveryFailed(serviceType: String, errorCode: Int) {
                Log.e(TAG, "Discovery stop failed: $errorCode")
            }
        }

        try {
            nsdManager.discoverServices(SERVICE_TYPE, NsdManager.PROTOCOL_DNS_SD, discoveryListener)
        } catch (e: Exception) {
            Log.e(TAG, "Error starting discovery", e)
        }
    }

    private fun resolveService(serviceInfo: NsdServiceInfo) {
        nsdManager.resolveService(serviceInfo, object : NsdManager.ResolveListener {
            override fun onResolveFailed(serviceInfo: NsdServiceInfo, errorCode: Int) {
                Log.e(TAG, "Resolve failed: $errorCode")
            }

            override fun onServiceResolved(resolvedInfo: NsdServiceInfo) {
                Log.d(TAG, "Resolve Succeeded. Host: \${resolvedInfo.host}, Port: \${resolvedInfo.port}")
                val item = DiscoveredService(
                    serviceName = resolvedInfo.serviceName,
                    host = resolvedInfo.host,
                    port = resolvedInfo.port
                )
                if (_discoveredHosts.value.none { it.serviceName == item.serviceName }) {
                    _discoveredHosts.value = _discoveredHosts.value + item
                }
            }
        })
    }

    fun stopDiscovery() {
        discoveryListener?.let {
            try {
                nsdManager.stopServiceDiscovery(it)
            } catch (e: Exception) {
                Log.e(TAG, "Error stopping discovery", e)
            }
            discoveryListener = null
        }
    }

    fun unregisterService() {
        registrationListener?.let {
            try {
                nsdManager.unregisterService(it)
            } catch (e: Exception) {
                Log.e(TAG, "Error unregistering service", e)
            }
            registrationListener = null
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/data/network/SocketServer.kt',
    name: 'SocketServer.kt',
    language: 'kotlin',
    description: 'Multi-threaded Coroutine Socket Server handling client handshakes, secret card distribution, and voting packets',
    category: 'network',
    content: `package com.imposter.party.data.network

import android.util.Log
import com.imposter.party.data.model.NetworkPacket
import com.imposter.party.data.model.PacketType
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.PrintWriter
import java.net.ServerSocket
import java.net.Socket
import java.util.concurrent.ConcurrentHashMap
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SocketServer @Inject constructor() {
    private val TAG = "SocketServer"
    private var serverSocket: ServerSocket? = null
    private var serverJob: Job? = null
    private val scope = CoroutineScope(Dispatchers.IO)

    private val connectedClients = ConcurrentHashMap<String, ClientConnection>()

    private val _incomingPackets = MutableSharedFlow<NetworkPacket>(extraBufferCapacity = 64)
    val incomingPackets: SharedFlow<NetworkPacket> = _incomingPackets.asSharedFlow()

    private val json = Json { ignoreUnknownKeys = true }

    data class ClientConnection(
        val id: String,
        val socket: Socket,
        val writer: PrintWriter,
        val reader: BufferedReader
    )

    fun start(port: Int = 8888, onPortBound: (Int) -> Unit) {
        stop()
        serverJob = scope.launch {
            try {
                serverSocket = ServerSocket(port).apply {
                    reuseAddress = true
                }
                val boundPort = serverSocket!!.localPort
                withContext(Dispatchers.Main) {
                    onPortBound(boundPort)
                }
                Log.d(TAG, "Server started on port $boundPort")

                while (isActive && serverSocket != null && !serverSocket!!.isClosed) {
                    val clientSocket = serverSocket!!.accept()
                    val clientId = "client_\${System.currentTimeMillis()}_\${clientSocket.port}"
                    launch {
                        handleNewClient(clientId, clientSocket)
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Server error", e)
            }
        }
    }

    private suspend fun handleNewClient(clientId: String, socket: Socket) = withContext(Dispatchers.IO) {
        try {
            val writer = PrintWriter(socket.getOutputStream(), true)
            val reader = BufferedReader(InputStreamReader(socket.getInputStream()))
            val conn = ClientConnection(clientId, socket, writer, reader)
            connectedClients[clientId] = conn
            Log.d(TAG, "Client connected: $clientId from \${socket.inetAddress}")

            while (socket.isConnected && !socket.isClosed) {
                val line = reader.readLine() ?: break
                if (line.isNotBlank()) {
                    try {
                        val packet = json.decodeFromString<NetworkPacket>(line)
                        _incomingPackets.emit(packet)
                    } catch (e: Exception) {
                        Log.e(TAG, "Failed to parse incoming packet: $line", e)
                    }
                }
            }
        } catch (e: Exception) {
            Log.d(TAG, "Client disconnected: $clientId")
        } finally {
            connectedClients.remove(clientId)
            try { socket.close() } catch (_: Exception) {}
        }
    }

    fun broadcast(packet: NetworkPacket) {
        scope.launch(Dispatchers.IO) {
            val serialized = json.encodeToString(packet)
            connectedClients.values.forEach { client ->
                try {
                    client.writer.println(serialized)
                } catch (e: Exception) {
                    Log.e(TAG, "Failed sending to client \${client.id}", e)
                }
            }
        }
    }

    fun sendToClient(clientId: String, packet: NetworkPacket) {
        scope.launch(Dispatchers.IO) {
            connectedClients[clientId]?.let { client ->
                try {
                    val serialized = json.encodeToString(packet)
                    client.writer.println(serialized)
                } catch (e: Exception) {
                    Log.e(TAG, "Failed sending private packet to $clientId", e)
                }
            }
        }
    }

    fun stop() {
        serverJob?.cancel()
        serverJob = null
        connectedClients.values.forEach {
            try { it.socket.close() } catch (_: Exception) {}
        }
        connectedClients.clear()
        try {
            serverSocket?.close()
        } catch (_: Exception) {}
        serverSocket = null
    }
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/data/network/SocketClient.kt',
    name: 'SocketClient.kt',
    language: 'kotlin',
    description: 'Client socket worker running coroutines to receive secret cards and game state from Host',
    category: 'network',
    content: `package com.imposter.party.data.network

import android.util.Log
import com.imposter.party.data.model.NetworkPacket
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.PrintWriter
import java.net.InetSocketAddress
import java.net.Socket
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SocketClient @Inject constructor() {
    private val TAG = "SocketClient"
    private var socket: Socket? = null
    private var writer: PrintWriter? = null
    private var clientJob: Job? = null
    private val scope = CoroutineScope(Dispatchers.IO)

    private val _isConnected = MutableStateFlow(false)
    val isConnected: StateFlow<Boolean> = _isConnected.asStateFlow()

    private val _incomingPackets = MutableSharedFlow<NetworkPacket>(extraBufferCapacity = 64)
    val incomingPackets: SharedFlow<NetworkPacket> = _incomingPackets.asSharedFlow()

    private val json = Json { ignoreUnknownKeys = true }

    fun connect(hostAddress: String, port: Int, onResult: (Boolean, String?) -> Unit) {
        disconnect()
        clientJob = scope.launch {
            try {
                val s = Socket()
                s.connect(InetSocketAddress(hostAddress, port), 5000)
                socket = s
                writer = PrintWriter(s.getOutputStream(), true)
                val reader = BufferedReader(InputStreamReader(s.getInputStream()))
                _isConnected.value = true

                withContext(Dispatchers.Main) {
                    onResult(true, null)
                }

                while (isActive && s.isConnected && !s.isClosed) {
                    val line = reader.readLine() ?: break
                    if (line.isNotBlank()) {
                        try {
                            val packet = json.decodeFromString<NetworkPacket>(line)
                            _incomingPackets.emit(packet)
                        } catch (e: Exception) {
                            Log.e(TAG, "Client failed parsing packet: $line", e)
                        }
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Connection error", e)
                withContext(Dispatchers.Main) {
                    onResult(false, e.message ?: "Failed to connect to host")
                }
            } finally {
                _isConnected.value = false
                disconnect()
            }
        }
    }

    fun sendPacket(packet: NetworkPacket) {
        scope.launch(Dispatchers.IO) {
            try {
                val serialized = json.encodeToString(packet)
                writer?.println(serialized)
            } catch (e: Exception) {
                Log.e(TAG, "Failed to send packet", e)
            }
        }
    }

    fun disconnect() {
        clientJob?.cancel()
        clientJob = null
        try {
            socket?.close()
        } catch (_: Exception) {}
        socket = null
        writer = null
        _isConnected.value = false
    }
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/di/AppModule.kt',
    name: 'AppModule.kt',
    language: 'kotlin',
    description: 'Hilt Dependency Injection module providing singleton network & repository instances',
    category: 'di',
    content: `package com.imposter.party.di

import android.content.Context
import com.imposter.party.data.network.NsdHelper
import com.imposter.party.data.network.SocketClient
import com.imposter.party.data.network.SocketServer
import com.imposter.party.data.repository.GameRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideGameRepository(): GameRepository {
        return GameRepository()
    }

    @Provides
    @Singleton
    fun provideNsdHelper(@ApplicationContext context: Context): NsdHelper {
        return NsdHelper(context)
    }

    @Provides
    @Singleton
    fun provideSocketServer(): SocketServer {
        return SocketServer()
    }

    @Provides
    @Singleton
    fun provideSocketClient(): SocketClient {
        return SocketClient()
    }
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/ui/theme/Color.kt',
    name: 'Color.kt',
    language: 'kotlin',
    description: 'Material 3 Dark Theme color palette: Obsidian, Cyber Cyan, Imposter Crimson, Gold',
    category: 'theme',
    content: `package com.imposter.party.ui.theme

import androidx.compose.ui.graphics.Color

// Premium Sleek Dark Theme Colors
val BackgroundDark = Color(0xFF0D1117)
val SurfaceDark = Color(0xFF161B22)
val SurfaceCard = Color(0xFF21262D)
val SurfaceCardElevated = Color(0xFF30363D)

val NeonCyan = Color(0xFF00F0FF)
val NeonCyanSubtle = Color(0x3300F0FF)
val ImposterCrimson = Color(0xFFFF2A55)
val ImposterCrimsonSubtle = Color(0x33FF2A55)

val ElectricPurple = Color(0xFF9D4EDD)
val GoldWinner = Color(0xFFFFD166)
val TextPrimary = Color(0xFFF0F6FC)
val TextSecondary = Color(0xFF8B949E)
val TextMuted = Color(0xFF6E7681)`
  },
  {
    path: 'app/src/main/java/com/imposter/party/ui/components/HoldToRevealCard.kt',
    name: 'HoldToRevealCard.kt',
    language: 'kotlin',
    description: 'Jetpack Compose pointerInput Hold-to-Reveal card with instant hide on touch release & haptics',
    category: 'components',
    content: `package com.imposter.party.ui.components

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.waitForUpOrCancellation
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Fingerprint
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.ShieldAlert
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.imposter.party.data.model.Role
import com.imposter.party.ui.theme.ImposterCrimson
import com.imposter.party.ui.theme.NeonCyan
import com.imposter.party.ui.theme.SurfaceCard
import com.imposter.party.ui.theme.SurfaceCardElevated
import com.imposter.party.ui.theme.TextMuted
import com.imposter.party.ui.theme.TextPrimary
import com.imposter.party.ui.theme.TextSecondary

@Composable
fun HoldToRevealCard(
    playerName: String,
    role: Role,
    secretWord: String,
    categoryName: String,
    modifier: Modifier = Modifier,
    onRevealedStateChange: (Boolean) -> Unit = {}
) {
    var isHolding by remember { mutableStateOf(false) }
    val context = LocalContext.current
    val vibrator = remember { context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator }

    val isImposter = role == Role.IMPOSTER
    val accentColor = if (isImposter) ImposterCrimson else NeonCyan

    val scaleAnim by animateFloatAsState(
        targetValue = if (isHolding) 0.97f else 1.0f,
        animationSpec = tween(durationMillis = 150),
        label = "card_scale"
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(420.dp)
            .scale(scaleAnim)
            .clip(RoundedCornerShape(24.dp))
            .background(SurfaceCard)
            .border(
                width = if (isHolding) 2.dp else 1.dp,
                brush = if (isHolding) Brush.linearGradient(listOf(accentColor, accentColor.copy(alpha = 0.3f)))
                        else Brush.linearGradient(listOf(Color(0xFF30363D), Color(0xFF21262D))),
                shape = RoundedCornerShape(24.dp)
            )
            .pointerInput(Unit) {
                // Production-grade gesture handler: instantaneous touch down & release
                awaitEachGesture {
                    val down = awaitFirstDown(requireUnconsumed = false)
                    isHolding = true
                    onRevealedStateChange(true)
                    
                    // Trigger tactile haptic feedback
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        vibrator?.vibrate(VibrationEffect.createOneShot(50, VibrationEffect.DEFAULT_AMPLITUDE))
                    }

                    val upOrCancel = waitForUpOrCancellation()
                    isHolding = false
                    onRevealedStateChange(false)
                }
            },
        contentAlignment = Alignment.Center
    ) {
        // HIDDEN STATE
        AnimatedVisibility(
            visible = !isHolding,
            enter = fadeIn(tween(100)),
            exit = fadeOut(tween(100))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(88.dp)
                        .clip(CircleShape)
                        .background(SurfaceCardElevated),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Fingerprint,
                        contentDescription = "Hold fingerprint",
                        tint = NeonCyan,
                        modifier = Modifier.size(52.dp)
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                Text(
                    text = "CONFIDENTIAL CARD",
                    color = TextMuted,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 2.sp
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Assigned to $playerName",
                    color = TextPrimary,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(16.dp))

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(50.dp))
                        .background(SurfaceCardElevated)
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = "PRESS & HOLD TO REVEAL",
                        color = NeonCyan,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = "Release immediately hides your card",
                    color = TextSecondary,
                    fontSize = 12.sp,
                    textAlign = TextAlign.Center
                )
            }
        }

        // REVEALED STATE
        AnimatedVisibility(
            visible = isHolding,
            enter = fadeIn(tween(100)),
            exit = fadeOut(tween(100))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            listOf(
                                accentColor.copy(alpha = 0.15f),
                                SurfaceCard
                            )
                        )
                    )
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                if (isImposter) {
                    Icon(
                        imageVector = Icons.Default.ShieldAlert,
                        contentDescription = "Imposter",
                        tint = ImposterCrimson,
                        modifier = Modifier.size(64.dp)
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Text(
                        text = "YOU ARE THE IMPOSTER!",
                        color = ImposterCrimson,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Black,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "Category: $categoryName",
                        color = TextPrimary,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Medium
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "You do not know the secret word. Blend in, listen to other clues, and avoid getting voted out!",
                        color = TextSecondary,
                        fontSize = 13.sp,
                        textAlign = TextAlign.Center,
                        lineHeight = 18.sp
                    )
                } else {
                    Text(
                        text = "YOU ARE A CREWMATE",
                        color = NeonCyan,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.5.sp
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Text(
                        text = "SECRET WORD",
                        color = TextMuted,
                        fontSize = 11.sp,
                        letterSpacing = 2.sp
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = secretWord,
                        color = TextPrimary,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Black,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "Category: $categoryName",
                        color = TextSecondary,
                        fontSize = 14.sp
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "Give a subtle clue during discussion so fellow crewmates recognize you, but don't give it away to the Imposter!",
                        color = TextMuted,
                        fontSize = 12.sp,
                        textAlign = TextAlign.Center,
                        lineHeight = 16.sp
                    )
                }
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/ui/components/DiscussionTimer.kt',
    name: 'DiscussionTimer.kt',
    language: 'kotlin',
    description: 'Compose animated circular timer with audio warning pulse',
    category: 'components',
    content: `package com.imposter.party.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.imposter.party.ui.theme.ImposterCrimson
import com.imposter.party.ui.theme.NeonCyan
import com.imposter.party.ui.theme.TextMuted
import com.imposter.party.ui.theme.TextPrimary

@Composable
fun DiscussionTimer(
    totalSeconds: Int,
    secondsLeft: Int,
    modifier: Modifier = Modifier
) {
    val progress = if (totalSeconds > 0) secondsLeft.toFloat() / totalSeconds.toFloat() else 0f
    val animatedProgress by animateFloatAsState(targetValue = progress, label = "timer_progress")

    val isWarning = secondsLeft <= 15
    val activeColor = if (isWarning) ImposterCrimson else NeonCyan

    val minutes = secondsLeft / 60
    val secs = secondsLeft % 60
    val formattedTime = String.format("%02d:%02d", minutes, secs)

    Box(
        modifier = modifier.size(180.dp),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.size(170.dp)) {
            // Background track
            drawArc(
                color = Color(0xFF21262D),
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                style = Stroke(width = 12.dp.toPx(), cap = StrokeCap.Round)
            )
            // Progress arc
            drawArc(
                color = activeColor,
                startAngle = -90f,
                sweepAngle = animatedProgress * 360f,
                useCenter = false,
                style = Stroke(width = 12.dp.toPx(), cap = StrokeCap.Round)
            )
        }

        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = formattedTime,
                color = if (isWarning) ImposterCrimson else TextPrimary,
                fontSize = 32.sp,
                fontWeight = FontWeight.Black
            )
            Text(
                text = if (isWarning) "HURRY UP" else "DISCUSSION",
                color = if (isWarning) ImposterCrimson else TextMuted,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.5.sp
            )
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/ui/viewmodel/GameViewModel.kt',
    name: 'GameViewModel.kt',
    language: 'kotlin',
    description: 'Pass & Play ViewModel managing game loop, turn-by-turn reveal state, countdown timer, and votes',
    category: 'viewmodel',
    content: `package com.imposter.party.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.imposter.party.data.model.GamePhase
import com.imposter.party.data.model.GameSettings
import com.imposter.party.data.model.GameState
import com.imposter.party.data.model.Player
import com.imposter.party.data.model.Role
import com.imposter.party.data.repository.GameRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class GameViewModel @Inject constructor(
    private val repository: GameRepository
) : ViewModel() {

    val categories = repository.categories

    private val _settings = MutableStateFlow(GameSettings())
    val settings: StateFlow<GameSettings> = _settings.asStateFlow()

    private val _playerNames = MutableStateFlow(
        listOf("Alex", "Jordan", "Taylor", "Morgan", "Sam")
    )
    val playerNames: StateFlow<List<String>> = _playerNames.asStateFlow()

    private val _gameState = MutableStateFlow(GameState())
    val gameState: StateFlow<GameState> = _gameState.asStateFlow()

    private var timerJob: Job? = null

    fun updateSettings(newSettings: GameSettings) {
        _settings.value = newSettings
        adjustPlayerCount(newSettings.playerCount)
    }

    fun setPlayerName(index: Int, name: String) {
        val current = _playerNames.value.toMutableList()
        if (index in current.indices) {
            current[index] = name
            _playerNames.value = current
        }
    }

    fun adjustPlayerCount(count: Int) {
        val target = count.coerceIn(3, 12)
        val current = _playerNames.value.toMutableList()
        while (current.size < target) {
            current.add("Player \${current.size + 1}")
        }
        while (current.size > target) {
            current.removeAt(current.size - 1)
        }
        _playerNames.value = current
        _settings.update { it.copy(playerCount = target) }
    }

    fun startPassPlayGame() {
        val initial = repository.initializePassPlayGame(_playerNames.value, _settings.value)
        _gameState.value = initial
    }

    fun nextPlayerReveal() {
        val current = _gameState.value
        val nextIdx = current.currentPlayerIndex + 1
        if (nextIdx < current.players.size) {
            _gameState.update {
                it.copy(
                    phase = GamePhase.PASS_PHONE,
                    currentPlayerIndex = nextIdx
                )
            }
        } else {
            // All players revealed, enter Discussion
            _gameState.update {
                it.copy(
                    phase = GamePhase.DISCUSSION,
                    isTimerRunning = true
                )
            }
            startTimer()
        }
    }

    fun startTimer() {
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            while (_gameState.value.timerSecondsLeft > 0 && _gameState.value.isTimerRunning) {
                delay(1000)
                _gameState.update {
                    val next = it.timerSecondsLeft - 1
                    it.copy(timerSecondsLeft = next)
                }
            }
        }
    }

    fun toggleTimer() {
        val running = !_gameState.value.isTimerRunning
        _gameState.update { it.copy(isTimerRunning = running) }
        if (running) startTimer() else timerJob?.cancel()
    }

    fun addTimerSeconds(seconds: Int) {
        _gameState.update { it.copy(timerSecondsLeft = it.timerSecondsLeft + seconds) }
    }

    fun proceedToVoting() {
        timerJob?.cancel()
        _gameState.update {
            it.copy(
                phase = GamePhase.VOTING,
                isTimerRunning = false
            )
        }
    }

    fun castVote(voterId: String, targetId: String) {
        _gameState.update { state ->
            val updatedPlayers = state.players.map { p ->
                if (p.id == voterId) p.copy(hasVoted = true, votedForId = targetId) else p
            }
            state.copy(players = updatedPlayers)
        }
    }

    fun finishVotingAndReveal() {
        val (eliminated, winner) = repository.tallyVotes(_gameState.value.players)
        _gameState.update {
            it.copy(
                phase = GamePhase.RESULTS,
                eliminatedPlayerId = eliminated?.id,
                winner = winner
            )
        }
    }

    override fun onCleared() {
        super.onCleared()
        timerJob?.cancel()
    }
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/ui/viewmodel/NetworkGameViewModel.kt',
    name: 'NetworkGameViewModel.kt',
    language: 'kotlin',
    description: 'StateFlow ViewModel coordinating Socket Server / Client and Network Service Discovery',
    category: 'viewmodel',
    content: `package com.imposter.party.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.imposter.party.data.model.Category
import com.imposter.party.data.model.GameMode
import com.imposter.party.data.model.GamePhase
import com.imposter.party.data.model.GameState
import com.imposter.party.data.model.NetworkPacket
import com.imposter.party.data.model.PacketType
import com.imposter.party.data.model.Player
import com.imposter.party.data.model.Role
import com.imposter.party.data.model.RoleAssignmentPayload
import com.imposter.party.data.network.DiscoveredService
import com.imposter.party.data.network.NsdHelper
import com.imposter.party.data.network.SocketClient
import com.imposter.party.data.network.SocketServer
import com.imposter.party.data.repository.GameRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import javax.inject.Inject
import kotlin.random.Random

@HiltViewModel
class NetworkGameViewModel @Inject constructor(
    private val repository: GameRepository,
    private val nsdHelper: NsdHelper,
    private val socketServer: SocketServer,
    private val socketClient: SocketClient
) : ViewModel() {

    val discoveredHosts: StateFlow<List<DiscoveredService>> = nsdHelper.discoveredHosts
    val isConnectedToHost: StateFlow<Boolean> = socketClient.isConnected

    private val _isHost = MutableStateFlow(false)
    val isHost: StateFlow<Boolean> = _isHost.asStateFlow()

    private val _hostPort = MutableStateFlow(8888)
    val hostPort: StateFlow<Int> = _hostPort.asStateFlow()

    private val _localPlayer = MutableStateFlow(
        Player(id = "local_player", name = "My Phone", isHost = false)
    )
    val localPlayer: StateFlow<Player> = _localPlayer.asStateFlow()

    private val _networkGameState = MutableStateFlow(GameState(mode = GameMode.LOCAL_WIFI_HOST))
    val networkGameState: StateFlow<GameState> = _networkGameState.asStateFlow()

    private val json = Json { ignoreUnknownKeys = true }

    init {
        // Collect incoming packets from socket server (if host)
        viewModelScope.launch {
            socketServer.incomingPackets.collect { packet ->
                handleServerIncomingPacket(packet)
            }
        }

        // Collect incoming packets from socket client (if client)
        viewModelScope.launch {
            socketClient.incomingPackets.collect { packet ->
                handleClientIncomingPacket(packet)
            }
        }
    }

    fun startHosting(roomName: String = "Imposter Party Room") {
        _isHost.value = true
        _localPlayer.update { it.copy(isHost = true, name = "Host Phone") }
        
        socketServer.start(port = 8888) { boundPort ->
            _hostPort.value = boundPort
            nsdHelper.registerService(boundPort, roomName)
        }

        _networkGameState.update {
            it.copy(
                mode = GameMode.LOCAL_WIFI_HOST,
                phase = GamePhase.SETUP,
                players = listOf(_localPlayer.value)
            )
        }
    }

    fun startDiscovery() {
        _isHost.value = false
        nsdHelper.startDiscovery()
    }

    fun joinHost(hostAddress: String, port: Int, playerName: String) {
        _localPlayer.update { it.copy(name = playerName, isHost = false) }
        socketClient.connect(hostAddress, port) { success, error ->
            if (success) {
                // Send Join request packet to Host
                val joinPacket = NetworkPacket(
                    type = PacketType.JOIN_REQUEST,
                    senderId = _localPlayer.value.id,
                    payloadJson = json.encodeToString(_localPlayer.value)
                )
                socketClient.sendPacket(joinPacket)
            }
        }
    }

    fun hostStartGame(categoryId: String, imposterCount: Int) {
        if (!_isHost.value) return
        val currentPlayers = _networkGameState.value.players
        if (currentPlayers.size < 3) return

        val category = repository.categories.find { it.id == categoryId } ?: repository.categories.first()
        val secretWord = category.words.random()

        // Random imposter assignment
        val imposterIndices = mutableSetOf<Int>()
        while (imposterIndices.size < imposterCount.coerceIn(1, 2)) {
            imposterIndices.add(Random.nextInt(currentPlayers.size))
        }

        val assignedPlayers = currentPlayers.mapIndexed { idx, player ->
            val isImposter = imposterIndices.contains(idx)
            val assignedRole = if (isImposter) Role.IMPOSTER else Role.CREWMATE
            val word = if (isImposter) "" else secretWord
            player.copy(role = assignedRole, secretWord = word)
        }

        _networkGameState.update {
            it.copy(
                phase = GamePhase.HOLD_REVEAL,
                players = assignedPlayers,
                selectedCategory = category,
                secretWord = secretWord
            )
        }

        // Send individual secret cards to clients
        assignedPlayers.forEach { p ->
            val payload = RoleAssignmentPayload(
                playerId = p.id,
                role = p.role,
                secretWord = p.secretWord,
                categoryName = category.name
            )
            val packet = NetworkPacket(
                type = PacketType.ASSIGN_SECRET,
                senderId = "host",
                payloadJson = json.encodeToString(payload)
            )
            socketServer.broadcast(packet)
        }
    }

    private fun handleServerIncomingPacket(packet: NetworkPacket) {
        when (packet.type) {
            PacketType.JOIN_REQUEST -> {
                val newPlayer = json.decodeFromString<Player>(packet.payloadJson)
                _networkGameState.update { state ->
                    val updated = (state.players.filter { it.id != newPlayer.id } + newPlayer)
                    state.copy(players = updated)
                }
            }
            PacketType.SUBMIT_VOTE -> {
                val voterId = packet.senderId
                val targetId = packet.payloadJson
                _networkGameState.update { state ->
                    val updated = state.players.map { p ->
                        if (p.id == voterId) p.copy(hasVoted = true, votedForId = targetId) else p
                    }
                    state.copy(players = updated)
                }
            }
            else -> {}
        }
    }

    private fun handleClientIncomingPacket(packet: NetworkPacket) {
        when (packet.type) {
            PacketType.ASSIGN_SECRET -> {
                val assignment = json.decodeFromString<RoleAssignmentPayload>(packet.payloadJson)
                if (assignment.playerId == _localPlayer.value.id || assignment.playerId == "all") {
                    _localPlayer.update {
                        it.copy(
                            role = assignment.role,
                            secretWord = assignment.secretWord
                        )
                    }
                    _networkGameState.update {
                        it.copy(
                            phase = GamePhase.HOLD_REVEAL,
                            secretWord = assignment.secretWord
                        )
                    }
                }
            }
            else -> {}
        }
    }

    override fun onCleared() {
        super.onCleared()
        nsdHelper.stopDiscovery()
        nsdHelper.unregisterService()
        socketServer.stop()
        socketClient.disconnect()
    }
}`
  }
];
