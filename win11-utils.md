
---

# 📘 20 Underrated Windows 11 Commands (with Examples)

| Command | Example | What It Does |
|---------|---------|--------------|
| **fsutil** | `fsutil fsinfo ntfsinfo D:` | Shows NTFS details like cluster size on D: |
| **robocopy** | `robocopy D:\ H:\Backup /MIR /MT:32` | Mirrors D: into H:\Backup using 32 threads |
| **cipher** | `cipher /w:D:` | Securely wipes free space on D: (erases deleted data) |
| **schtasks** | `schtasks /create /sc daily /tn "Backup" /tr "robocopy D:\ H:\Backup /MIR"` | Schedules a daily backup task |
| **tasklist** | `tasklist /fi "imagename eq chrome.exe"` | Lists all running Chrome processes |
| **taskkill** | `taskkill /im notepad.exe /f` | Force‑kills Notepad |
| **driverquery** | `driverquery /v /fo table` | Lists all drivers with detailed info |
| **systeminfo** | `systeminfo | findstr /B /C:"OS Name" /C:"OS Version"` | Shows OS name and version |
| **wmic** | `wmic cpu get name` | Displays CPU model |
| **netstat** | `netstat -ano` | Shows all active network connections with PIDs |
| **arp** | `arp -a` | Displays ARP cache (IP ↔ MAC mappings) |
| **nslookup** | `nslookup microsoft.com` | Resolves DNS for microsoft.com |
| **tracert** | `tracert microsoft.com` | Traces route to microsoft.com |
| **ping** | `ping 8.8.8.8` | Tests connectivity to Google DNS |
| **assoc** | `assoc .txt` | Shows which program opens `.txt` files |
| **ftype** | `ftype txtfile="C:\Windows\System32\notepad.exe" %1` | Forces `.txt` files to open in Notepad |
| **clip** | `dir | clip` | Copies directory listing into clipboard |
| **tree** | `tree D:\ /f` | Displays folder hierarchy of D: with files |
| **fc** | `fc file1.txt file2.txt` | Compares two text files line by line |
| **findstr** | `findstr /i "error" log.txt` | Searches for “error” in log.txt (case‑insensitive) |

---

## 🔹 Why These Matter
- **Disk & file management**: `fsutil`, `robocopy`, `cipher`  
- **Automation & scheduling**: `schtasks`, `findstr`  
- **Diagnostics**: `systeminfo`, `driverquery`, `netstat`  
- **Convenience tricks**: `clip`, `tree`, `fc`  

---

✅ **Summary:**  
These commands are already in Windows 11 — no installs needed. They give you **powerful control over files, disks, and system info** right from `cmd.exe`.  

---
