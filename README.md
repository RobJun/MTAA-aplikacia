# BookRef
### Description
Aplikácia na predmet MTAA (Mobilné technológie a aplikácie). Bookref je aplikácia pre milovníkov kníh, ktorí sa chcú svoju záľubu zdieľať s ostatnými. V našej aplikácií si môžu robiť svoje vlastné knižné kluby, v ktorých sa môžu týždenne stretávať cez video konferenčný hovor a preberať knihy. Zároveň aplikácia slúži aj na organizáciu kníh do knižnice, aby čitateľ mal všetky knihy, ktoré číta, chce čítať a prečítať na jednom mieste.

### Obrazovky
![obrazok hlavnych prechodv obrazoviek](./docs/poprepajane.png)

### Videohovor

Signalizačný server je implementovaný na našom backende. Endpoint videohovoru je /video/<club_id>/ a berie query parameter q={token} a pripája sa na server cez ws://<SERVER>.
Frontend bol implementovaný pomocou knižnice react-native-webrtc. Má základné kontrolné prvky (vypnutie/zapnutie mikrofónu/kamery, zrušenie hovoru a otočenie kamery). Boli nastavené TURN a STUN servery z platformy Open Relay prevádzkovaného na https://www.metered.ca/tools/openrelay/.  
WebRTC videokonferencia bola implementovaná za pomoci tutorialu [Real Time Video Chat Tutorial Using Django and WebRTC](https://www.youtube.com/watch?v=MBOlZMLaQ8g "Real Time Video Chat Tutorial Using Django and WebRTC")

### Frontend
Kód je napísaný v jazyku JavaScript s React Native rozhraním. Celá aplikácia sa skladá z 15 obrazoviek, pričom každá obrazovka má svoj priečinok s vlastným index.js. Všetky fotky, ktoré používateľ do aplikácie nahráva ako profilové fotky sa pred odoslaním komprimujú. 
Štruktúra projektu: 
-	Screens – všetky obrazovky aplikácie
-	Navigations – navigácie aplikácie, nachádza sa tu hlavná navigácia pre celú aplikáciu, navigácia pre prihlásenie sa do aplikácie
-	Forms – súbor na vytvorenie/úpravu klubu, ktorý sa používa viackrát v kóde
-	Context – globálny kontext s globálnymi stavmi pre celú aplikáciu
-	Components – časti kódu, ktoré sa viackrát používajú v kóde, ako napríklad tlačidlá, profilové fotky, textové polia na overovanie vstupov...
-	Api_calls – väčšina API volaní

### Offline
Jedina funkcionalita, ktorá nie je povolená v offline režime je vytváranie klubov a menenie názvu klubu (z dôvodu, že nevieme hneď overiť, že či klub s menom už náhodou už existuje. Zároveň sa nedá pripojiť do videohovoru, registrovať a ani prihlasiť (ak používateľ predtým nebol už prihlásený). Zvyšná funkcionalita je funkčná aj v offline režime.

### Odkazy
API volania: https://app.swaggerhub.com/apis/RobJun/MTAA/1.5.1-oas3 
Backend: https://github.com/dnhrvnk/MTAA-backend
Frontend: https://github.com/RobJun/MTAA-aplikacia 
