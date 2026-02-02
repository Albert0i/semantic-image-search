
# **Running Windows Utilities on Zorin OS with Bottles: A Complete Guide**

Many Linux users occasionally need to run a Windows utility — perhaps a small `.exe` program that comes bundled with its own DLLs and resources. On Zorin OS, this is entirely possible thanks to **Bottles**, a modern manager for Wine. Bottles simplifies the process of installing, configuring, and running Windows applications, while also letting you create shortcuts so they feel like native Linux apps.

---

## Step 1: Install Bottles
Zorin OS is based on Ubuntu, so you can install Bottles directly from the **Software store** or via **Flatpak**:

```bash
sudo apt install flatpak
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install flathub com.usebottles.bottles
```

Once installed, launch Bottles from the Zorin menu.

---

## Step 2: Create a New Bottle
1. Open Bottles and click **“+ Create a new Bottle.”**  
2. Give it a name (e.g., `ConvertZ`).  
3. Choose **Application** as the environment type (lighter runner, ideal for utilities).  
4. Bottles will prepare the Wine environment automatically.

---

## Step 3: Add Your Utility
1. Place your `ConvertZ.exe` and all required DLLs/resources into a folder on your Linux system (e.g., `~/ConvertZ`).  
2. In Bottles, open the `ConvertZ` bottle.  
3. Go to **Programs → Add new program** and select your `ConvertZ.exe`.  

---

## Step 4: Configure Dependencies
- If your utility requires specific DLLs, place them either in the same folder as `ConvertZ.exe` or inside the bottle’s `drive_c/windows/system32`.  
- Use Bottles’ **Dependencies tab** to install common runtimes (DirectX, .NET, Visual C++).  
- For DLL overrides, go to **Settings → Advanced → DLL overrides** and specify the required libraries.

---

## Step 5: Run the Utility
- In Bottles, open the **Programs** section.  
- Click on `ConvertZ.exe` to launch it.  
- The utility should run with its bundled resources just like on Windows.

---

## Step 6: Create a Shortcut
To make your utility feel native on Zorin OS:
1. In Bottles, go to **Programs**.  
2. Next to `ConvertZ.exe`, click the **three dots menu → Create shortcut**.  
3. Bottles generates a `.desktop` entry, so you’ll see **ConvertZ** in your Zorin menu.  
4. You can also pin it to your taskbar for quick access.

---

## Step 7: Optional Tweaks
- **Integration**: Shortcuts behave like native apps, searchable in the Zorin menu.  
- **Isolation**: Each bottle is independent, so different apps won’t interfere.  
- **Backup**: Export bottles to move them to another machine if needed.  

---

### ✅ Conclusion
By installing Bottles, creating a dedicated bottle, and adding your `.exe` with its resources, you can run Windows utilities like **ConvertZ.exe** seamlessly on Zorin OS. With shortcut integration, the app feels native, making Linux a practical environment even for legacy Windows tools.

---
