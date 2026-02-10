### The story behind PHLIB
> "The only attitude worthy of a superior man is to persist in an activity he recognizes is useless, to observe a discipline he knows is sterile, and to apply certain norms of philosophical and metaphysical thought that he considers utterly inconsequential" <br /><br />"A única atitude digna de um homem superior é o persistir tenaz de uma atividade que se reconhece inútil, o hábito de uma disciplina que se sabe estéril, e o uso fixo de normas de pensamento filosófico e metafísico cuja importância se sente ser nula."<br/>--- The Book of Disquiet by Fernando Pessoa


#### Prologue 
Furture is unknown, what we know so far is called *history*. To live is not to forget, to write is not to forget, idiots forget while geniuses forgive... I am here to pen down my opinionated story about **PHLIB**. To begin with, let's back to the year of 2012...

At that epoch, We were using **DB/400** on **AS/400** as sole platform, due to statistical requirement, a monthly snapshot was taken by copying production files into new library named PH*YYYYMM* at the end of each month, where YYYY is year, MM is month. In the year of 2017, a migration was planned from **DB2/400** to **Oracle**. In the year of 2019, **XRunner** project, which was written in [ASP.NET Web Forms](https://en.wikipedia.org/wiki/ASP.NET_Web_Forms), rolled out in an effort to: 

1. Facilitates creation of tables in Oracle according to definition in DB2/400; 
2. Copies data from DB/400 to Oracle, this enables one-way synchronization on a scheduled base; 
3. Facilitates execution of SQL statements on both platforms; 
4. Dump tables from DB/400 in text format suitable for Oracle import; 

Until 2025, the migration has not finished but the target database was abandoned prematurely! The new platform is not determined so much the worse... As of this writing, there are more than 8000 tables in snapshot... and this legacy data gets detained and stagnates thenceforth. In a couple of years, I believe, AS/400 will fade out and [all those tables will be lost in time, like tears in the rain](https://www.reddit.com/r/QuotesPorn/comments/bn497r/all_those_moments_will_be_lost_in_time_like_tears/). 

Suddenly, a whimsical idea dawned upon me: To dump all out, convert them into general SQL syntax and feed them into a third party database, [SQLite](https://sqlite.org/) seems the natural choice in this circumstance. 


#### I. Generation and Conversion
The process, which involves five steps, is quite tedious — more accurately, it is drudgery.

1. Gather meta data of tables from snapshot libraries; 

This requires running `DSPFD` command for each snapshot library in AS/400 command line. 
```
DSPFD FILE(PH202509/*ALL) TYPE(*BASATR) OUTPUT(*OUTFILE) OUTFILE(ALBERTOI/PH202509) 
```
![alt DSPFD](img/DSPFD.JPG)

2. Add meta data to repository; 

This requires running `INSERT INTO` statement for each snapshot library using whichever SQL client you prefer. 
```
insert into albertoi.phlibpf
( select * from albertoi.PH202509 )
```

3. Run **libDump** utility to dump snapshot tables into text format; 

This requires hosting **XRunner** and type in URL in browser: 
```
http://localhost/xr/LibDump400.aspx?libName=PH2025&data=yes
```
![alt libDump](img/libDump.JPG)

4. Convert SQL dump from Oracle format to SQLite format;

This requires running `oracle-to-sqlite.js` with proper parameters:
```
node src/oracle-to-sqlite.js "H:\\PHLIB\\2025" "H:\\PHLIB.SQLITE\\2025"
```

5. Load all converted SQL dump into SQLite; 

This requires running `loaddb.bat` with proper parameters:
```
loaddb.bat H:\PHLIB.db H:\PHLIB.SQLITE\2025
```

Repeat from step 1 to 5 for all snapshot libraries. When it is done, you can query snapshot database with ease: 
![alt phlib](/img/PHLIB.JPG)


#### II. Full rundown for 2026.
1. 
```
DSPFD FILE(PH202601/*ALL) TYPE(*BASATR) OUTPUT(*OUTFILE) OUTFILE(ALBERTOI/PH202601) 
DSPFD FILE(PH202602/*ALL) TYPE(*BASATR) OUTPUT(*OUTFILE) OUTFILE(ALBERTOI/PH202602) 
DSPFD FILE(PH202603/*ALL) TYPE(*BASATR) OUTPUT(*OUTFILE) OUTFILE(ALBERTOI/PH202603) 
DSPFD FILE(PH202604/*ALL) TYPE(*BASATR) OUTPUT(*OUTFILE) OUTFILE(ALBERTOI/PH202604) 
DSPFD FILE(PH202605/*ALL) TYPE(*BASATR) OUTPUT(*OUTFILE) OUTFILE(ALBERTOI/PH202605) 
DSPFD FILE(PH202606/*ALL) TYPE(*BASATR) OUTPUT(*OUTFILE) OUTFILE(ALBERTOI/PH202606) 
DSPFD FILE(PH202607/*ALL) TYPE(*BASATR) OUTPUT(*OUTFILE) OUTFILE(ALBERTOI/PH202607) 
DSPFD FILE(PH202608/*ALL) TYPE(*BASATR) OUTPUT(*OUTFILE) OUTFILE(ALBERTOI/PH202608) 
DSPFD FILE(PH202609/*ALL) TYPE(*BASATR) OUTPUT(*OUTFILE) OUTFILE(ALBERTOI/PH202601) 
DSPFD FILE(PH202610/*ALL) TYPE(*BASATR) OUTPUT(*OUTFILE) OUTFILE(ALBERTOI/PH202610) 
DSPFD FILE(PH202611/*ALL) TYPE(*BASATR) OUTPUT(*OUTFILE) OUTFILE(ALBERTOI/PH202611) 
DSPFD FILE(PH202612/*ALL) TYPE(*BASATR) OUTPUT(*OUTFILE) OUTFILE(ALBERTOI/PH202612) 
```

2. 
```
insert into albertoi.phlibpf
( 
    select * from albertoi.PH202601 union 
    select * from albertoi.PH202602 union 
    select * from albertoi.PH202603 union 
    select * from albertoi.PH202604 union 
    select * from albertoi.PH202605 union 
    select * from albertoi.PH202606 union 
    select * from albertoi.PH202607 union 
    select * from albertoi.PH202608 union 
    select * from albertoi.PH202609 union 
    select * from albertoi.PH202610 union 
    select * from albertoi.PH202611 union 
    select * from albertoi.PH202612
)
```

3. 
```
http://localhost/xr/LibDump400.aspx?libName=PH2026&data=yes
```

4. 
```
node src/oracle-to-sqlite.js "H:\\PHLIB\\2026" "H:\\PHLIB.SQLITE\\2026"
```

5. 
```
loaddb.bat H:\PHLIB.db H:\PHLIB.SQLITE\2026
```


#### III. Reminiscence
The frist half  of this project is written with [ASP.NET 2.0](https://learn.microsoft.com/zh-tw/aspnet/web-forms/overview/moving-to-aspnet-20/) + [ODBC](https://zh.wikipedia.org/zh-tw/ODBC) +  [IBM AS/400](https://en.wikipedia.org/wiki/IBM_AS/400), which are definitely stone-age techniques and most modern programmers not familiar with or even unheard of; the second half is in [NodeJS](https://nodejs.org/en) + [SQLite](https://sqlite.org/), which are state of the art tools. The first half is running on [Windows XP](https://zh.wikipedia.org/zh-tw/Windows_XP) while the second part is running on [Windows 11](https://en.wikipedia.org/wiki/Windows_11). 

I have to restate that my Windows XP, with 3G RAM and on 30G disk, run [IIS](https://en.wikipedia.org/wiki/Internet_Information_Services )5.1.smoothly... and this is exactly what an [Operating System](https://en.wikipedia.org/wiki/Operating_system) should be. 

![alt Windows XP](img/windows-xp.JPG)

The composite evinces new possibility on problem solving domain. It is a journey of the past; it is a quest to the future... 


#### IV. Bibliography 
1. [SQLite Is ULTIMATE Choice For 99% of Projects](https://youtu.be/9RArbqGOvsw)
2. [The Book of Disquiet by Fernando Pessoa](https://dn720004.ca.archive.org/0/items/english-collections-1/Book%20of%20Disquiet%2C%20The%20-%20Fernando%20Pessoa.pdf)


#### Epilogue 
In SQLite, “files” don’t exist inside the database — everything is stored in a single `.db` file. What you *can* calculate are:
1. **Number of schema objects** (tables, indexes, views, triggers) — this is the closest analogue to “number of files.”
2. **Total database file size in GB** — using page size × page count.
Here are two SQL snippets you can run directly in SQLite:

1️⃣ Calculate number of “files” (schema objects)
```
-- Count all objects in the database schema
SELECT type, COUNT(*) AS object_count
FROM sqlite_master
GROUP BY type;
```
This will return counts for `table`, `index`, `view`, and `trigger`.

2️⃣ Calculate total database size in GB
```
-- Compute database file size in gigabytes
SELECT ROUND((page_count * page_size) / (1024.0 * 1024 * 1024), 3) AS size_gb
FROM pragma_page_count(), pragma_page_size();
```
• `page_size` = bytes per page
• `page_count` = number of pages
• Multiply them for total bytes, then divide by `1024^3` to convert to GB.
• `ROUND(...3)` gives you precision to 3 decimal places.

✨ Together, these queries let you see both how many schema objects exist and how large the database file is on disk


**Extended Reading**:
- [Reflux](https://github.com/Albert0i/albert0i.github.io/blob/main/reflux.md)


### EOF (2026/02/10)
