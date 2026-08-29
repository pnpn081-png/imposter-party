import { CodeFile } from './androidCodebase';

export const ANDROID_SCREENS_CODEBASE: CodeFile[] = [
  {
    path: 'app/src/main/java/com/imposter/party/ui/theme/Theme.kt',
    name: 'Theme.kt',
    language: 'kotlin',
    description: 'Material 3 Dark ColorScheme and Typography definitions',
    category: 'theme',
    content: `package com.imposter.party.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = NeonCyan,
    onPrimary = BackgroundDark,
    secondary = ImposterCrimson,
    onSecondary = TextPrimary,
    tertiary = ElectricPurple,
    background = BackgroundDark,
    surface = SurfaceDark,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
    surfaceVariant = SurfaceCard,
    onSurfaceVariant = TextSecondary
)

@Composable
fun ImposterPartyTheme(
    content: @Composable () -> Unit
) {
    val colorScheme = DarkColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = BackgroundDark.toArgb()
            window.navigationBarColor = BackgroundDark.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
            WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/ui/theme/Type.kt',
    name: 'Type.kt',
    language: 'kotlin',
    description: 'Modern typography scale for crisp readable in-game clue cards and timers',
    category: 'theme',
    content: `package com.imposter.party.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Typography = Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Black,
        fontSize = 36.sp,
        lineHeight = 44.sp,
        letterSpacing = (-0.5).sp
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 24.sp,
        lineHeight = 32.sp
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 20.sp,
        lineHeight = 26.sp
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp
    ),
    labelMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 12.sp,
        letterSpacing = 1.sp
    )
)`
  },
  {
    path: 'app/src/main/java/com/imposter/party/ui/screens/HomeScreen.kt',
    name: 'HomeScreen.kt',
    language: 'kotlin',
    description: 'Game Mode selector: Pass & Play vs Local Wi-Fi Host / Join',
    category: 'screens',
    content: `package com.imposter.party.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.PhoneAndroid
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material.icons.filled.ShieldAlert
import androidx.compose.material.icons.filled.Wifi
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.imposter.party.ui.theme.BackgroundDark
import com.imposter.party.ui.theme.ImposterCrimson
import com.imposter.party.ui.theme.NeonCyan
import com.imposter.party.ui.theme.SurfaceCard
import com.imposter.party.ui.theme.TextMuted
import com.imposter.party.ui.theme.TextPrimary
import com.imposter.party.ui.theme.TextSecondary

@Composable
fun HomeScreen(
    onPassPlaySelected: () -> Unit,
    onHostWifiSelected: () -> Unit,
    onJoinWifiSelected: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(top = 32.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(72.dp)
                    .clip(CircleShape)
                    .background(SurfaceCard)
                    .border(1.5.dp, NeonCyan, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.ShieldAlert,
                    contentDescription = "App Logo",
                    tint = NeonCyan,
                    modifier = Modifier.size(40.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "IMPOSTER PARTY",
                style = MaterialTheme.typography.displayLarge,
                color = TextPrimary,
                fontWeight = FontWeight.Black
            )

            Text(
                text = "OFFLINE MULTIPLAYER SOCIAL DEDUCTION",
                color = NeonCyan,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 2.sp
            )
        }

        // Mode cards
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            ModeSelectionCard(
                title = "Pass & Play",
                badge = "SINGLE PHONE",
                description = "3 to 12 players share one phone. Hold-to-reveal secret cards and discuss.",
                icon = Icons.Default.PhoneAndroid,
                accentColor = NeonCyan,
                onClick = onPassPlaySelected
            )

            ModeSelectionCard(
                title = "Host Local Room",
                badge = "HOTSPOT / WI-FI",
                description = "Broadcast an offline game room using NSD. Nearby phones auto-connect without internet.",
                icon = Icons.Default.Wifi,
                accentColor = Color(0xFF9D4EDD),
                onClick = onHostWifiSelected
            )

            ModeSelectionCard(
                title = "Join Room",
                badge = "CLIENT DEVICE",
                description = "Discover local hosts or connect directly by host IP on the same Wi-Fi or Hotspot.",
                icon = Icons.Default.Group,
                accentColor = Color(0xFF38EF7D),
                onClick = onJoinWifiSelected
            )
        }

        // Footer info
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = Icons.Default.ShieldAlert,
                contentDescription = null,
                tint = TextMuted,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = "100% Offline • Zero internet required",
                color = TextMuted,
                fontSize = 12.sp
            )
        }
    }
}

@Composable
fun ModeSelectionCard(
    title: String,
    badge: String,
    description: String,
    icon: ImageVector,
    accentColor: Color,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = SurfaceCard),
        shape = RoundedCornerShape(16.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(accentColor.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = accentColor,
                    modifier = Modifier.size(26.dp)
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = title,
                        color = TextPrimary,
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .background(accentColor.copy(alpha = 0.2f))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = badge,
                            color = accentColor,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black
                        )
                    }
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = description,
                    color = TextSecondary,
                    fontSize = 12.sp,
                    lineHeight = 16.sp
                )
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/ui/screens/PassPlaySetupScreen.kt',
    name: 'PassPlaySetupScreen.kt',
    language: 'kotlin',
    description: 'Setup screen with player count (3-12), 1 or 2 Imposters selector, and Category carousel',
    category: 'screens',
    content: `package com.imposter.party.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Category
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.ShieldAlert
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.imposter.party.ui.theme.BackgroundDark
import com.imposter.party.ui.theme.ImposterCrimson
import com.imposter.party.ui.theme.NeonCyan
import com.imposter.party.ui.theme.SurfaceCard
import com.imposter.party.ui.theme.SurfaceCardElevated
import com.imposter.party.ui.theme.TextMuted
import com.imposter.party.ui.theme.TextPrimary
import com.imposter.party.ui.theme.TextSecondary
import com.imposter.party.ui.viewmodel.GameViewModel

@Composable
fun PassPlaySetupScreen(
    onStartGame: () -> Unit,
    onBack: () -> Unit,
    viewModel: GameViewModel = hiltViewModel()
) {
    val settings by viewModel.settings.collectAsState()
    val playerNames by viewModel.playerNames.collectAsState()
    val categories = viewModel.categories

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(20.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                IconButton(onClick = onBack) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Back",
                        tint = TextPrimary
                    )
                }
                Text(
                    text = "Pass & Play Setup",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Player Count Stepper
            Text(
                text = "PLAYER COUNT (3-12)",
                color = TextMuted,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(SurfaceCard)
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                IconButton(
                    onClick = { viewModel.adjustPlayerCount(settings.playerCount - 1) },
                    enabled = settings.playerCount > 3
                ) {
                    Icon(Icons.Default.Remove, contentDescription = "Decrease", tint = NeonCyan)
                }

                Text(
                    text = "\${settings.playerCount} Players",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )

                IconButton(
                    onClick = { viewModel.adjustPlayerCount(settings.playerCount + 1) },
                    enabled = settings.playerCount < 12
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Increase", tint = NeonCyan)
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Imposter Count Switcher (1 or 2)
            Text(
                text = "IMPOSTER ROLES",
                color = TextMuted,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                listOf(1, 2).forEach { count ->
                    val isSelected = settings.imposterCount == count
                    val isAvailable = count == 1 || settings.playerCount >= 6
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(14.dp))
                            .background(if (isSelected) ImposterCrimson.copy(alpha = 0.2f) else SurfaceCard)
                            .border(
                                width = if (isSelected) 2.dp else 1.dp,
                                color = if (isSelected) ImposterCrimson else Color(0xFF30363D),
                                shape = RoundedCornerShape(14.dp)
                            )
                            .clickable(enabled = isAvailable) {
                                viewModel.updateSettings(settings.copy(imposterCount = count))
                            }
                            .padding(vertical = 14.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "$count Imposter\${if (count > 1) "s" else ""}",
                                color = if (isSelected) ImposterCrimson else TextPrimary,
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp
                            )
                            if (count == 2 && settings.playerCount < 6) {
                                Text(text = "Requires 6+ players", color = TextMuted, fontSize = 10.sp)
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Category Selection
            Text(
                text = "CATEGORY",
                color = TextMuted,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
            Spacer(modifier = Modifier.height(8.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                items(categories) { category ->
                    val isSelected = settings.categoryId == category.id
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(14.dp))
                            .background(if (isSelected) NeonCyan.copy(alpha = 0.2f) else SurfaceCard)
                            .border(
                                width = if (isSelected) 2.dp else 1.dp,
                                color = if (isSelected) NeonCyan else Color(0xFF30363D),
                                shape = RoundedCornerShape(14.dp)
                            )
                            .clickable {
                                viewModel.updateSettings(settings.copy(categoryId = category.id))
                            }
                            .padding(horizontal = 16.dp, vertical = 12.dp)
                    ) {
                        Text(
                            text = category.name,
                            color = if (isSelected) NeonCyan else TextPrimary,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 14.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Player Names customization
            Text(
                text = "PLAYER NAMES",
                color = TextMuted,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
            Spacer(modifier = Modifier.height(8.dp))
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                playerNames.forEachIndexed { index, name ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(SurfaceCard)
                            .padding(horizontal = 12.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(28.dp)
                                .clip(CircleShape)
                                .background(SurfaceCardElevated),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "\${index + 1}",
                                color = NeonCyan,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = name,
                            color = TextPrimary,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Start button
        Button(
            onClick = {
                viewModel.startPassPlayGame()
                onStartGame()
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            colors = ButtonDefaults.buttonColors(containerColor = NeonCyan),
            shape = RoundedCornerShape(16.dp)
        ) {
            Icon(Icons.Default.PlayArrow, contentDescription = null, tint = BackgroundDark)
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "START PASS & PLAY",
                color = BackgroundDark,
                fontWeight = FontWeight.Black,
                fontSize = 16.sp
            )
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/ui/screens/PassPlayRevealScreen.kt',
    name: 'PassPlayRevealScreen.kt',
    language: 'kotlin',
    description: 'Turn-based secret reveal screen using HoldToRevealCard with auto-hiding protection',
    category: 'screens',
    content: `package com.imposter.party.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.imposter.party.ui.components.HoldToRevealCard
import com.imposter.party.ui.theme.BackgroundDark
import com.imposter.party.ui.theme.NeonCyan
import com.imposter.party.ui.theme.SurfaceCard
import com.imposter.party.ui.theme.TextMuted
import com.imposter.party.ui.theme.TextPrimary
import com.imposter.party.ui.viewmodel.GameViewModel

@Composable
fun PassPlayRevealScreen(
    onAllCardsRevealed: () -> Unit,
    onQuit: () -> Unit,
    viewModel: GameViewModel = hiltViewModel()
) {
    val gameState by viewModel.gameState.collectAsState()
    val currentPlayer = gameState.players.getOrNull(gameState.currentPlayerIndex) ?: return
    val totalPlayers = gameState.players.size
    val progress = (gameState.currentPlayerIndex + 1).toFloat() / totalPlayers.toFloat()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                IconButton(onClick = onQuit) {
                    Icon(Icons.Default.Close, contentDescription = "Quit", tint = TextMuted)
                }

                Text(
                    text = "Player \${gameState.currentPlayerIndex + 1} of $totalPlayers",
                    color = TextMuted,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.size(48.dp))
            }

            Spacer(modifier = Modifier.height(8.dp))

            LinearProgressIndicator(
                progress = { progress },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(RoundedCornerShape(3.dp)),
                color = NeonCyan,
                trackColor = SurfaceCard,
            )

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "Pass phone to",
                color = TextMuted,
                fontSize = 14.sp
            )

            Text(
                text = currentPlayer.name,
                color = TextPrimary,
                fontSize = 26.sp,
                fontWeight = FontWeight.Black
            )
        }

        // The Custom Hold-To-Reveal Card
        HoldToRevealCard(
            playerName = currentPlayer.name,
            role = currentPlayer.role,
            secretWord = currentPlayer.secretWord,
            categoryName = gameState.selectedCategory?.name ?: "General"
        )

        // Next turn button
        Button(
            onClick = {
                if (gameState.currentPlayerIndex + 1 >= gameState.players.size) {
                    viewModel.nextPlayerReveal()
                    onAllCardsRevealed()
                } else {
                    viewModel.nextPlayerReveal()
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            colors = ButtonDefaults.buttonColors(containerColor = SurfaceCard),
            shape = RoundedCornerShape(16.dp)
        ) {
            Text(
                text = if (gameState.currentPlayerIndex + 1 >= gameState.players.size) 
                    "FINISH & START DISCUSSION" else "I'VE MEMORIZED IT (NEXT PLAYER)",
                color = NeonCyan,
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp
            )
            Icon(Icons.Default.ArrowForward, contentDescription = null, tint = NeonCyan)
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/ui/screens/DiscussionScreen.kt',
    name: 'DiscussionScreen.kt',
    language: 'kotlin',
    description: 'Discussion phase with countdown timer, speaker order, and vote call trigger',
    category: 'screens',
    content: `package com.imposter.party.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.HowToVote
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.imposter.party.ui.components.DiscussionTimer
import com.imposter.party.ui.theme.BackgroundDark
import com.imposter.party.ui.theme.ImposterCrimson
import com.imposter.party.ui.theme.NeonCyan
import com.imposter.party.ui.theme.SurfaceCard
import com.imposter.party.ui.theme.TextMuted
import com.imposter.party.ui.theme.TextPrimary
import com.imposter.party.ui.theme.TextSecondary
import com.imposter.party.ui.viewmodel.GameViewModel

@Composable
fun DiscussionScreen(
    onStartVoting: () -> Unit,
    onCancel: () -> Unit,
    viewModel: GameViewModel = hiltViewModel()
) {
    val gameState by viewModel.gameState.collectAsState()
    val settings by viewModel.settings.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "DISCUSSION PHASE",
                color = NeonCyan,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 2.sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Give Clues & Interrogate",
                color = TextPrimary,
                fontSize = 22.sp,
                fontWeight = FontWeight.Black
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Take turns stating a 1-word or short clue related to the secret word. If you are the Imposter, pretend you know it!",
                color = TextSecondary,
                fontSize = 13.sp,
                textAlign = TextAlign.Center,
                lineHeight = 18.sp
            )
        }

        // Circular Countdown Timer
        DiscussionTimer(
            totalSeconds = settings.discussionTimeSeconds,
            secondsLeft = gameState.timerSecondsLeft
        )

        // Controls
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedButton(
                    onClick = { viewModel.toggleTimer() },
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(
                        imageVector = if (gameState.isTimerRunning) Icons.Default.Pause else Icons.Default.PlayArrow,
                        contentDescription = null,
                        tint = TextPrimary
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = if (gameState.isTimerRunning) "Pause" else "Resume", color = TextPrimary)
                }

                OutlinedButton(
                    onClick = { viewModel.addTimerSeconds(30) },
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(text = "+30s More", color = NeonCyan)
                }
            }

            Button(
                onClick = {
                    viewModel.proceedToVoting()
                    onStartVoting()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                colors = ButtonDefaults.buttonColors(containerColor = ImposterCrimson),
                shape = RoundedCornerShape(16.dp)
            ) {
                Icon(Icons.Default.HowToVote, contentDescription = null, tint = TextPrimary)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "CALL EMERGENCY VOTE",
                    color = TextPrimary,
                    fontWeight = FontWeight.Black,
                    fontSize = 15.sp
                )
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/ui/screens/VotingScreen.kt',
    name: 'VotingScreen.kt',
    language: 'kotlin',
    description: 'Voting screen allowing players to select who they suspect is the Imposter',
    category: 'screens',
    content: `package com.imposter.party.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.HowToVote
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.imposter.party.ui.theme.BackgroundDark
import com.imposter.party.ui.theme.ImposterCrimson
import com.imposter.party.ui.theme.NeonCyan
import com.imposter.party.ui.theme.SurfaceCard
import com.imposter.party.ui.theme.SurfaceCardElevated
import com.imposter.party.ui.theme.TextMuted
import com.imposter.party.ui.theme.TextPrimary
import com.imposter.party.ui.theme.TextSecondary
import com.imposter.party.ui.viewmodel.GameViewModel

@Composable
fun VotingScreen(
    onVotingFinished: () -> Unit,
    viewModel: GameViewModel = hiltViewModel()
) {
    val gameState by viewModel.gameState.collectAsState()
    var selectedSuspectId by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "VOTING PHASE",
                color = ImposterCrimson,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 2.sp
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "Who is the Imposter?",
                color = TextPrimary,
                fontSize = 22.sp,
                fontWeight = FontWeight.Black
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "Select the player with the most votes to eliminate them.",
                color = TextSecondary,
                fontSize = 13.sp
            )
        }

        // Players Grid
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            items(gameState.players) { player ->
                val isSelected = selectedSuspectId == player.id
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(if (isSelected) ImposterCrimson.copy(alpha = 0.2f) else SurfaceCard)
                        .border(
                            width = if (isSelected) 2.dp else 1.dp,
                            color = if (isSelected) ImposterCrimson else SurfaceCardElevated,
                            shape = RoundedCornerShape(16.dp)
                        )
                        .clickable { selectedSuspectId = player.id }
                        .padding(16.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(
                            modifier = Modifier
                                .size(50.dp)
                                .clip(CircleShape)
                                .background(SurfaceCardElevated),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Person,
                                contentDescription = null,
                                tint = if (isSelected) ImposterCrimson else TextSecondary,
                                modifier = Modifier.size(30.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Text(
                            text = player.name,
                            color = TextPrimary,
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp
                        )

                        if (isSelected) {
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "SUSPECTED",
                                color = ImposterCrimson,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Black
                            )
                        }
                    }
                }
            }
        }

        Button(
            onClick = {
                selectedSuspectId?.let { suspectId ->
                    gameState.players.firstOrNull()?.id?.let { voterId ->
                        viewModel.castVote(voterId, suspectId)
                    }
                    viewModel.finishVotingAndReveal()
                    onVotingFinished()
                }
            },
            enabled = selectedSuspectId != null,
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            colors = ButtonDefaults.buttonColors(containerColor = ImposterCrimson),
            shape = RoundedCornerShape(16.dp)
        ) {
            Icon(Icons.Default.Check, contentDescription = null, tint = TextPrimary)
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "CONFIRM ELIMINATION",
                color = TextPrimary,
                fontWeight = FontWeight.Black,
                fontSize = 15.sp
            )
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/imposter/party/ui/screens/ResultsScreen.kt',
    name: 'ResultsScreen.kt',
    language: 'kotlin',
    description: 'Dramatic elimination and winner reveal with secret word and imposter breakdown',
    category: 'screens',
    content: `package com.imposter.party.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Replay
import androidx.compose.material.icons.filled.ShieldAlert
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.imposter.party.data.model.Role
import com.imposter.party.ui.theme.BackgroundDark
import com.imposter.party.ui.theme.GoldWinner
import com.imposter.party.ui.theme.ImposterCrimson
import com.imposter.party.ui.theme.NeonCyan
import com.imposter.party.ui.theme.SurfaceCard
import com.imposter.party.ui.theme.SurfaceCardElevated
import com.imposter.party.ui.theme.TextMuted
import com.imposter.party.ui.theme.TextPrimary
import com.imposter.party.ui.theme.TextSecondary
import com.imposter.party.ui.viewmodel.GameViewModel

@Composable
fun ResultsScreen(
    onPlayAgain: () -> Unit,
    onHome: () -> Unit,
    viewModel: GameViewModel = hiltViewModel()
) {
    val gameState by viewModel.gameState.collectAsState()
    val eliminatedPlayer = gameState.players.find { it.id == gameState.eliminatedPlayerId }
    val wasImposter = eliminatedPlayer?.role == Role.IMPOSTER
    val crewmatesWon = gameState.winner == Role.CREWMATE

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(CircleShape)
                    .background(if (crewmatesWon) NeonCyan.copy(alpha = 0.15f) else ImposterCrimson.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (crewmatesWon) Icons.Default.EmojiEvents else Icons.Default.ShieldAlert,
                    contentDescription = null,
                    tint = if (crewmatesWon) GoldWinner else ImposterCrimson,
                    modifier = Modifier.size(46.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = if (crewmatesWon) "CREWMATES WIN!" else "IMPOSTERS WIN!",
                color = if (crewmatesWon) NeonCyan else ImposterCrimson,
                fontSize = 26.sp,
                fontWeight = FontWeight.Black
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = if (wasImposter) {
                    "\${eliminatedPlayer?.name} was the Imposter!"
                } else {
                    "\${eliminatedPlayer?.name} was an innocent Crewmate!"
                },
                color = TextSecondary,
                fontSize = 15.sp,
                textAlign = TextAlign.Center
            )
        }

        // Word card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .background(SurfaceCard)
                .padding(20.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "THE SECRET WORD WAS",
                    color = TextMuted,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 2.sp
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = gameState.secretWord,
                    color = TextPrimary,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Category: \${gameState.selectedCategory?.name}",
                    color = NeonCyan,
                    fontSize = 13.sp
                )
            }
        }

        // Imposters breakdown list
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "PLAYER ROLES BREAKDOWN",
                color = TextMuted,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
            Spacer(modifier = Modifier.height(8.dp))
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                gameState.players.forEach { p ->
                    val isImp = p.role == Role.IMPOSTER
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(SurfaceCardElevated)
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = p.name, color = TextPrimary, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                        Text(
                            text = if (isImp) "IMPOSTER" else "CREWMATE",
                            color = if (isImp) ImposterCrimson else NeonCyan,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black
                        )
                    }
                }
            }
        }

        // Actions
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(
                onClick = onHome,
                modifier = Modifier.weight(1f).height(52.dp),
                shape = RoundedCornerShape(14.dp)
            ) {
                Icon(Icons.Default.Home, contentDescription = null, tint = TextPrimary)
                Spacer(modifier = Modifier.width(6.dp))
                Text(text = "Home", color = TextPrimary)
            }

            Button(
                onClick = onPlayAgain,
                modifier = Modifier.weight(1.5f).height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = NeonCyan),
                shape = RoundedCornerShape(14.dp)
            ) {
                Icon(Icons.Default.Replay, contentDescription = null, tint = BackgroundDark)
                Spacer(modifier = Modifier.width(6.dp))
                Text(text = "Play Again", color = BackgroundDark, fontWeight = FontWeight.Bold)
            }
        }
    }
}`
  }
];
