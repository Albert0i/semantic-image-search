###
> "The only attitude worthy of a superior man is to persist in an activity he recognizes is useless, to observe a discipline he knows is sterile, and to apply certain norms of philosophical and metaphysical thought that he considers utterly inconsequential" <br /><br />"A única atitude digna de um homem superior é o persistir tenaz de uma atividade que se reconhece inútil, o hábito de uma disciplina que se sabe estéril, e o uso fixo de normas de pensamento filosófico e metafísico cuja importância se sente ser nula."<br/>--- The Book of Disquiet by Fernando Pessoa


#### Prologue 


#### 

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