# PRO OC DZS Proxy

## Použití

GET <serverUrl>/dotaz.nsf?kdo=&dD=&dM=&dR=

```
kdo=<Kmenove čislo>
dD=<Den narození např. 19>
dM=<Měsíc narození např. 05>
dR=<Rok narození např. 1994>
```

Péči hradí MZČR
```
<font color="#FFFFFF">&gt;</font>
<b>Jméno přijmení</b>
<br>
<font color="#FFFFFF">&gt;</font>
<font size="2">student momentálně </font>
<font size="2" color="#008000">STUDUJE</font>
<font size="2">, péči hradí MZČR.</font>
```
 
Nenalezeno
```
<font color="#FFFFFF">&gt;</font>
<b>Nenalezeno</b>
<br>
<font color="#FFFFFF">&gt;</font>
<font size="2">student momentálně </font>
<font size="2" color="#FF0000">NESTUDUJE</font>
<font size="2">, péči hradí jako samoplátce.</font>
```

## Build docker image dzs

```
sudo docker build -t dzs . --progress=plain
```

## Spuštění docker image vzp-b2b

Env proměnné lokálně vkládané např. z jiného git repozitáře:

1) **(required)** ```ENCRYPT_KEY```
3) **(optional)** ```PORT``` (default 3000)

```
export ENCRYPT_KEY=$(cat ../pro-oc-vfn-secrets/encryptionkey.txt)

sudo docker run --network host -it \
-e ENCRYPT_KEY="${ENCRYPT_KEY}" \
dzs
```