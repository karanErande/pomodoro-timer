# Quick Start Guide - Pomodoro Timer

## 🚀 Getting Started (30 seconds)

1. **Open the app**: Double-click `index.html` in your file explorer
2. **Start working**: Click the purple play button
3. **Stay focused**: Timer counts down from 25 minutes
4. **Get notified**: Alert sound plays when session ends
5. **Take a break**: Timer automatically suggests a 5-minute break

---

## 🎮 Main Controls

### Timer Panel (Default View)

**Mode Selection** (Top buttons)
- **Work**: 25-minute focus sessions (purple)
- **Short Break**: 5-minute recovery (green)
- **Long Break**: 15-minute extended rest (cyan)

**Control Buttons** (Center)
- **Reset** (⟲): Restart current session from beginning
- **Play/Pause** (▶️): Start or pause the timer
- **Skip** (⏭️): Skip to next session type

**Sound Control** (Bottom)
- Select alert sound from dropdown
- Click "Test" to preview the sound
- Choose "Silent" for no audio

---

## ⚙️ Settings Guide

### Timer Durations
- Adjust work, break, and long break lengths (in minutes)
- Changes apply immediately to next session
- Click ➕ or ➖ to increment/decrement

### Session Cycling
- Choose how many work sessions before a long break
- Options: 2, 3, 4, 5, or 6 sessions
- Default: 4 (long break after 4 work sessions)

### Productivity Goals
- Set your daily target for completed work sessions
- Visible on the Dashboard

### Automation Options
- **Auto-start Breaks**: Automatically begins break after work finishes
- **Auto-start Sessions**: Automatically begins work after break finishes
- **Browser Notifications**: Enable desktop alerts when timer ends

### Saving
- Click **Save Settings** to apply and persist changes
- Settings are saved to your browser's storage

---

## 📊 Dashboard Overview

### Quick Stats (Top Cards)
- **Today**: Sessions completed today
- **Focus time**: Total minutes spent working today
- **Total sessions**: All-time session count
- **Day streak**: Consecutive days with at least one session

### Activity Chart
- 7-day bar chart showing sessions per day
- Colored bars indicate data (colored bars = sessions completed)
- Today's bar shown with different color (green)

### Recent Activity
- List of last 10 sessions with timestamps
- Shows session type (work/break) and duration
- Scrollable list for history

### Clear Data
- Remove all historical data and reset stats
- Requires confirmation (cannot be undone)

---

## 🔊 Sound Options Explained

| Sound | Best For | Style |
|-------|----------|-------|
| **Bell** | Professional environment | Melodic, ascending |
| **Chime** | Cheerful notification | Multi-tone bells |
| **Digital** | Technical workspace | Beeping sounds |
| **Soft ping** | Quiet work space | Gentle, subtle |
| **Silent** | Library/meeting | No audio |

**Tip**: Use "Test" button to hear each sound before using it in sessions!

---

## ⌨️ Pro Tips

1. **Keyboard Shortcut**: Press `Space` to play/pause (faster than clicking)

2. **Focus Mode**: Set auto-start features to keep momentum without clicking

3. **Sound Alert**: Test your chosen sound during settings to avoid surprises

4. **Daily Goal**: Set a realistic goal and track your progress on Dashboard

5. **Session Dots**: Watch the small dots below the timer to see your session progress

6. **Browser Tab**: Title bar shows current time, so you can monitor from tab

7. **Data Backup**: Your data is safe in browser storage - try copying settings before clearing data

---

## ❓ Troubleshooting

### Timer not starting?
- Make sure you clicked the Play button (▶️)
- Check browser console for errors (F12)
- Try refreshing the page

### Sound not playing?
- Verify the selected sound isn't "Silent"
- Check browser volume isn't muted
- Try the "Test" button in Sound Bar
- Some browsers require user interaction before playing audio

### Settings not saving?
- Click the "Save Settings" button (easy to forget!)
- Check if browser allows localStorage
- Try disabling browser extensions that block storage

### Dashboard showing 0 sessions?
- You need to complete at least one full work session
- Sessions only count when timer runs to completion
- History is stored locally (won't sync across browsers)

### Data disappeared?
- Clearing browser cache/cookies deletes localStorage data
- Each browser stores data separately
- No backup exists - be careful with "Clear all data" button

### Timer seems slow/fast?
- This is browser dependent - background processes affect accuracy
- Not a problem for practical Pomodoro use
- Consider taking a break if you notice the issue!

---

## 🎯 Pomodoro Technique Tips

The Pomodoro Technique is designed around these principles:

1. **Break down work** into 25-minute focus blocks
2. **Remove distractions** during focus time
3. **Take regular breaks** to recharge
4. **Track sessions** to build accountability
5. **Long breaks** after multiple sessions

### Recommended Workflow:
- Set your daily goal (8-10 sessions is ambitious)
- Work on ONE task during each 25-minute session
- Use breaks to stretch, hydrate, or relax
- After 4 sessions, take the longer 15-minute break
- Review your progress on the Dashboard at day's end

---

## 📱 Mobile Usage

The app works great on phones and tablets!

- **Landscape mode** recommended for best view
- Touch-friendly buttons sized for mobile
- All features work on smartphones
- Data syncs across devices (each browser separately)

---

## 🔒 Privacy & Data

- ✅ **No server data**: Everything stored locally
- ✅ **No tracking**: No analytics or telemetry
- ✅ **No account required**: No login needed
- ✅ **Completely offline**: Works without internet
- ⚠️ **Browser specific**: Data doesn't sync across browsers
- ⚠️ **One device only**: Data doesn't sync across devices

---

## 🎓 Learning Points (Why Features Work This Way)

**Sound Generation with Web Audio API**
- Creates sounds without downloading files
- More efficient and responsive
- Allows customization

**localStorage for Data**
- Fast, built-in browser storage
- Persistent across sessions
- Suitable for small, local data

**Responsive CSS**
- Works on any screen size
- Grid-based layout adapts naturally
- Touch-friendly on mobile

**SVG Progress Ring**
- Scales perfectly to any size
- Smooth animations possible
- Accessible to screen readers

---

## 💡 Customization Ideas

Want to modify the app? Try these:

1. **Change colors**: Edit `--clr-*` variables in style.css
2. **Adjust default times**: Modify initial values in app.js
3. **Add new sounds**: Use Web Audio API to create more tones
4. **Change fonts**: Update `--font-*` variables in style.css
5. **Add emoji**: Insert emojis in notifications and buttons

---

## 📞 Need Help?

- Check browser console (F12 → Console tab) for error messages
- Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Try refreshing the page (Ctrl+R or Cmd+R)
- Check that JavaScript is enabled in your browser

---

**Happy focusing! 🎯 You've got this! 💪**
