### The story behind PHLIB
> "The only attitude worthy of a superior man is to persist in an activity he recognizes is useless, to observe a discipline he knows is sterile, and to apply certain norms of philosophical and metaphysical thought that he considers utterly inconsequential" <br /><br />"A única atitude digna de um homem superior é o persistir tenaz de uma atividade que se reconhece inútil, o hábito de uma disciplina que se sabe estéril, e o uso fixo de normas de pensamento filosófico e metafísico cuja importância se sente ser nula."<br/>--- The Book of Disquiet by Fernando Pessoa


#### Prologue 
Furture is unknown, what we know so far is called *history*. To live is not to forget... I am here to pen down my opinionated story behind **PHLIB**. To begin with, let's date back to 2012. 

We were using DB/400 on AS/400 platform and due to statistic requirement, a monthly snapshot was taken by copying production files into new library named PH*YYYYMM* at the end of each month, where YYYY is year, MM is month. In the year of 2017, a migration was planned from DB2/400 to Oracle. In the year of 2019, the **XRunner** project was rolled out with purpose of: 

1. Facilitates creation of database tables in Oracle according to definition in DB2/400; 
2. Copies data from DB/400 to Oracle, this enables one-way synchronization on a scheduled base; 
3. Facilitates execution of SQL statements on both platforms; 
4. Dump database tables from DB/400 in format suitable for Oracle import; 

Until 2025, the migration process has not finished but the target database was abandoned! And the new database is not known so much the worse... As of this writing, there are more than eight thousands snapshot files in total... and this legacy data gets detained and stagnatd. My concern is in a couple of years, AS/400 will fade out and [all those tables will be lost in time, like tears in the rain](https://www.reddit.com/r/QuotesPorn/comments/bn497r/all_those_moments_will_be_lost_in_time_like_tears/). 

My idea is to dump all out, convert them into general SQL syntax and feed them into some agnostic database. In this way, [SQLite](https://sqlite.org/) seems my natural choice. 


#### I. Generate the SQL dump
The whole process involves: 
1. Gather file info from snapshot libraries; 

This requires running `DSPFD` command for each snapshot library in AS/400 command line. 
2. Merging all file info to make a repository; 

This requires running `INSERT INTO` statement for each snapshot library using whichever SQL client you prefer. 
3. Run **libDump** utility dump snapshot of a year;

This requires hosting XRunner and typing URL on browser: 
```
http://localhost/xr/LibDump400.aspx?libName=PH2026&data=yes
```
4. Convert SQL dump into general syntax;

This requires running `oracle-to-sqlite.js` with proper parameters:
```
node src/oracle-to-sqlite.js "H:\\PHLIB\\2026" "H:\\PHLIB.SQLITE\\2026"
```
5. Load all new SQL dump into SQLite;  

This requires running `loaddb.bat` with proper parameters:
```
loaddb.bat H:\PHLIB.db H:\PHLIB.SQLITE\2026
```

Repeat point 4 and 5 until snapshot libraries exhaust. 
![alt phlib](/img/PHLIB.JPG)


#### II. 

#### III. 

#### IV. Full rundown for 2026.
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

```
http://localhost/xr/LibDump400.aspx?libName=PH2026&data=yes
```

```
node src/oracle-to-sqlite.js "H:\\PHLIB\\2026" "H:\\PHLIB.SQLITE\\2026"
```

```
loaddb.bat H:\PHLIB.db H:\PHLIB.SQLITE\2026
```


#### V. Bibliography 
1. [SQLite Is ULTIMATE Choice For 99% of Projects](https://youtu.be/9RArbqGOvsw)
2. [The Book of Disquiet by Fernando Pessoa](https://dn720004.ca.archive.org/0/items/english-collections-1/Book%20of%20Disquiet%2C%20The%20-%20Fernando%20Pessoa.pdf)


#### Epilogue 
```
DSPFD FILE(PH202509/*ALL) TYPE(*BASATR) OUTPUT(*OUTFILE) OUTFILE(ALBERTOI/PH202509) 

insert into albertoi.phlibpf
( select * from albertoi.PH202509 )

SELECT * FROM albertoi/phlibpf   
where atlib='PH202509'    
```

```
http://localhost/xr/LibDump400.aspx?libName=PH2025&data=yes
```

```
node src/oracle-to-sqlite.js "H:\\PHLIB\\2012" "H:\\PHLIB.SQLITE\\2012"

loaddb.bat data\db.sq3 H:\PHLIB.SQLITE\2012

loaddb.bat H:\PHLIB.db H:\PHLIB.SQLITE\2012
```

### EOF (2026/01/xx)


In SQLite, “files” don’t exist inside the database — everything is stored in a single  file. What you can calculate are:
1. 	Number of schema objects (tables, indexes, views, triggers) — this is the closest analogue to “number of files.”
2. 	Total database file size in GB — using page size × page count.
Here are two SQL snippets you can run directly in SQLite:

1️⃣ Calculate number of “files” (schema objects
```
-- Count all objects in the database schema
SELECT type, COUNT(*) AS object_count
FROM sqlite_master
GROUP BY type;
```
This will return counts for , , , and .
If you only want tables (like “data files”):

2️⃣ Calculate total database size in GB
```
-- Compute database file size in gigabytes
SELECT ROUND((page_count * page_size) / (1024.0 * 1024 * 1024), 3) AS size_gb
FROM pragma_page_count(), pragma_page_size();
```
• page_size = bytes per page
• page_count = number of pages
• Multiply them for total bytes, then divide by  to convert to GB.
• ROUND(...3) gives you precision to 3 decimal places.
