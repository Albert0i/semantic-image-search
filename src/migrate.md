
# 📘 Data Migration Guide (Windows 11, cmd.exe + Built‑in Tools)

## 1. Check Current Block Size (Cluster Size)
Open **cmd.exe** and run:
```cmd
fsutil fsinfo ntfsinfo D:
```
- Look for the line: **Bytes Per Cluster**  
  - `65536` = 64 KB clusters  
  - `4096` = 4 KB clusters  

This confirms the current block size of your drive.

---

## 2. Copy Data Out (Backup to Another Disk)
Use **Robocopy**, which is built into Windows 11:

```cmd
robocopy D:\ H:\D_backup /MIR /MT:32 /R:1 /W:1
```

- `D:\` → source drive (currently 64 KB clusters).  
- `H:\D_backup` → destination folder on H: drive.  
- `/MIR` → mirror all files and folders.  
- `/MT:32` → multithreaded copy (32 threads for speed).  
- `/R:1 /W:1` → retry once, wait 1 second (avoids long hangs).  

👉 This copies the entire content of D: into a folder on H:.

---

## 3. Reformat the Source Drive with 4 KB Block Size
Use **Disk Management** (built‑in GUI tool):

1. Press `Win + X` → choose **Disk Management**.  
2. Right‑click the **D: partition** → **Format**.  
3. Select:  
   - File system: **NTFS**  
   - Allocation unit size: **4096 bytes (4 KB)**  
   - Volume label: optional  
4. Confirm → this erases all data on D:.

---

## 4. Copy Data Back
Restore files from the backup folder on H: to the newly formatted D: drive:

```cmd
robocopy H:\D_backup D:\ /MIR /MT:32 /R:1 /W:1
```

👉 Now all files are back on D:, stored with **4 KB clusters**.

---

## 5. Verify Results
Check block size again in **cmd.exe**:
```cmd
fsutil fsinfo ntfsinfo D:
```
- Confirm **Bytes Per Cluster = 4096**.  
- Right‑click D: → **Properties** → compare **Size** vs. **Size on disk**.  
- You should see reduced disk usage if most files are small.

---

## 🔹 Notes
- **System disk (C:)**: Cannot be reformatted this way while Windows is running. Use installation media for clean install if needed.  
- **Data disks (D:, E:, etc.)**: Safe to reformat using Disk Management.  
- **Performance trade‑off**:  
  - 4 KB clusters → conserve space, better for small files.  
  - 64 KB clusters → faster for large sequential files, but wastes space.  

---

✅ **Summary:**  
1. Use `fsutil` in cmd.exe to check block size.  
2. Use `robocopy` to copy all files into a folder on another disk.  
3. Reformat the source drive with NTFS, 4 KB clusters.  
4. Use `robocopy` again to restore files.  
5. Verify block size and disk usage.  

---
