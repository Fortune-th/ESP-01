//% color=#0fbc11 icon="\uf1eb" block="ESP8266 AT Full"
namespace ESP8266AT {
    let txPin: SerialPin = SerialPin.P0
    let rxPin: SerialPin = SerialPin.P1
    let serialInited = false

    //% block="ตั้งขา Serial TX: %tx RX: %rx"
    //% tx.fieldEditor="gridpicker" rx.fieldEditor="gridpicker"
    //% group="🛠 การตั้งค่าพอร์ต"
    export function setSerialPins(tx: SerialPin, rx: SerialPin): void {
        txPin = tx; rxPin = rx
        serial.redirect(txPin, rxPin, BaudRate.BaudRate115200)
        serial.setRxBufferSize(256)
        serialInited = true
    }

    function initSerial(): void {
        if (!serialInited) {
            serial.redirect(txPin, rxPin, BaudRate.BaudRate115200)
            serial.setRxBufferSize(256)
            serialInited = true
        }
    }

    //% block="ส่งคำสั่ง AT: %cmd"
    //% group="🛠 การตั้งค่าพอร์ต"
    export function sendAT(cmd: string): void {
        initSerial()
        serial.writeString(cmd + "\r\n")
    }

    //% block="ส่ง AT %cmd แล้วรอ %delay มิลลิวินาที"
    //% group="🛠 การตั้งค่าพอร์ต"
    export function sendAndWait(cmd: string, delay: number): string {
        initSerial()
        serial.writeString(cmd + "\r\n")
        basic.pause(delay)
        return serial.readString()
    }

    //% block="อ่านผลลัพธ์จาก ESP"
    //% group="🛠 การตั้งค่าพอร์ต"
    export function readResponse(): string {
        initSerial()
        return serial.readString()
    }

    // UART
    //% block="ตั้ง UART baud:%baud databits:%db stopbits:%sb parity:%par flowctl:%fc"
    //% group="🛠 UART"
    export function setUART(baud: number, db: number, sb: number, par: number, fc: number): void {
        sendAT(`AT+UART=${baud},${db},${sb},${par},${fc}`)
    }
    //% block="ตรวจสอบการตั้งค่า UART"
    //% group="🛠 UART"
    export function queryUART(): void {
        sendAT(`AT+UART?`)
    }

    // Wi‑Fi
    //% block="ตรวจสอบโหมด Wi‑Fi"
    //% group="📡 Wi-Fi"
    export function queryMode(): void { sendAT("AT+CWMODE?") }
    //% block="ตั้งโหมด Wi‑Fi เป็น %mode"
    //% mode.min=1 mode.max=3
    //% group="📡 Wi-Fi"
    export function setMode(mode: number): void { sendAT(`AT+CWMODE=${mode}`) }
    //% block="ตรวจสอบสถานะ Wi‑Fi"
    //% group="📡 Wi-Fi"
    export function queryAP(): void { sendAT("AT+CWJAP?") }
    //% block="เชื่อม Wi‑Fi SSID: %ssid รหัสผ่าน: %pwd"
    //% ssid.shadow="text" pwd.shadow="text"
    //% group="📡 Wi-Fi"
    export function connectAP(ssid: string, pwd: string): void { sendAT(`AT+CWJAP_CUR="${ssid}","${pwd}"`) }
    //% block="ตัดการเชื่อม Wi‑Fi"
    //% group="📡 Wi-Fi"
    export function disconnectAP(): void { sendAT("AT+CWQAP") }
    //% block="สแกนหา Wi‑Fi"
    //% group="📡 Wi-Fi"
    export function scanAP(): void { sendAT("AT+CWLAP") }
    //% block="ตั้ง Access Point SSID: %ssid รหัส: %pwd channel: %ch encryption: %enc"
    //% group="📡 Wi-Fi"
    export function setAP(ssid: string, pwd: string, ch: number, enc: number): void {
        sendAT(`AT+CWSAP="${ssid}","${pwd}",${ch},${enc}`)
    }
    //% block="ตรวจสอบค่า AP ปัจจุบัน"
    //% group="📡 Wi-Fi"
    export function queryAPConfig(): void { sendAT(`AT+CWSAP?`) }
    //% block="แสดงรายชื่อ Client ที่เชื่อม"
    //% group="📡 Wi-Fi"
    export function listClients(): void { sendAT("AT+CWLIF") }

    // IP & DHCP
    //% block="แสดง IP Address"
    //% group="🌐 IP & DHCP"
    export function queryIP(): void { sendAT("AT+CIFSR") }
    //% block="ตรวจสอบการตั้งค่า IP"
    //% group="🌐 IP & DHCP"
    export function queryIPConfig(): void { sendAT("AT+CIPSTA?") }
    //% block="ตั้ง IP: %ip Gateway: %gw Netmask: %nm"
    //% ip.shadow="text" gw.shadow="text" nm.shadow="text"
    //% group="🌐 IP & DHCP"
    export function setStaticIP(ip: string, gw: string, nm: string): void {
        sendAT(`AT+CIPSTA="${ip}","${gw}","${nm}"`)
    }
    //% block="ตรวจสอบ DHCP"
    //% group="🌐 IP & DHCP"
    export function queryDHCP(): void { sendAT("AT+CWDHCP?") }
    //% block="ตั้ง DHCP mode:%mode enable:%en"
    //% group="🌐 IP & DHCP"
    export function setDHCP(mode: number, en: number): void {
        sendAT(`AT+CWDHCP=${mode},${en}`)
    }

    // TCP/IP
    //% block="ตรวจสอบโหมด multiple connection"
    //% group="🌐 TCP/IP"
    export function queryMux(): void { sendAT("AT+CIPMUX?") }
    //% block="ตั้ง multiple connection เป็น %m (0/1)"
    //% group="🌐 TCP/IP"
    export function setMux(m: number): void { sendAT(`AT+CIPMUX=${m}`) }
    //% block="เชื่อม TCP ไปยัง IP: %ip พอร์ต: %port"
    //% group="🌐 TCP/IP"
    export function startTCP(ip: string, port: number): void {
        sendAT(`AT+CIPSTART="TCP","${ip}",${port}`)
    }
    //% block="เชื่อม UDP ไปยัง IP: %ip พอร์ต: %port"
    //% group="🌐 TCP/IP"
    export function startUDP(ip: string, port: number): void {
        sendAT(`AT+CIPSTART="UDP","${ip}",${port}`)
    }
    //% block="เชื่อม ID: %id prot: %proto IP: %ip พอร์ต: %port"
    //% group="🌐 TCP/IP"
    export function startID(id: number, proto: string, ip: string, port: number): void {
        sendAT(`AT+CIPSTART=${id},"${proto}","${ip}",${port}`)
    }
    //% block="ส่งข้อมูลขนาด: %len byte"
    //% group="🌐 TCP/IP"
    export function sendLen(len: number): void { sendAT(`AT+CIPSEND=${len}`) }
    //% block="ส่งข้อมูล ID: %id ขนาด: %len byte"
    //% group="🌐 TCP/IP"
    export function sendLenID(id: number, len: number): void { sendAT(`AT+CIPSEND=${id},${len}`) }
    //% block="ปิด connection"
    //% group="🌐 TCP/IP"
    export function closeConn(): void { sendAT("AT+CIPCLOSE") }
    //% block="ปิด ID connection: %id"
    //% group="🌐 TCP/IP"
    export function closeConnID(id: number): void { sendAT(`AT+CIPCLOSE=${id}`) }
    //% block="ตรวจสอบสถานะ connection"
    //% group="🌐 TCP/IP"
    export function connStatus(): void { sendAT("AT+CIPSTATUS") }
    //% block="ตั้งโหมดรับข้อมูล: %m"
    //% group="🌐 TCP/IP"
    export function setRecvMode(m: number): void { sendAT(`AT+CIPRECVMODE=${m}`) }
    //% block="ตั้ง Transparent mode: %m"
    //% group="🌐 TCP/IP"
    export function setModeTransparent(m: number): void { sendAT(`AT+CIPMODE=${m}`) }

    // Server
    //% block="เปิด Server พอร์ต: %port"
    //% group="📡 Server"
    export function enableServer(port: number): void { sendAT(`AT+CIPSERVER=1,${port}`) }
    //% block="ปิด Server"
    //% group="📡 Server"
    export function disableServer(): void { sendAT("AT+CIPSERVER=0") }
    //% block="ตั้ง Server timeout: %sec วินาที"
    //% group="📡 Server"
    export function serverTimeout(sec: number): void { sendAT(`AT+CIPSTO=${sec}`) }

    // DNS & Ping
    //% block="ตรวจสอบ DNS"
    //% group="🌐 DNS & Ping"
    export function queryDNS(): void { sendAT("AT+CDNSCFG?") }
    //% block="ตั้ง DNS d1: %d1 d2: %d2"
    //% group="🌐 DNS & Ping"
    export function setDNS(d1: string, d2: string): void { sendAT(`AT+CDNSCFG="${d1}","${d2}"`) }
    //% block="Ping host: %host"
    //% group="🌐 DNS & Ping"
    export function pingHost(host: string): void { sendAT(`AT+PING="${host}"`) }

    // Power & RF
    //% block="ตั้ง Sleep mode: %mode (0=off 1=light 2=modem)"
    //% group="⚡ Power & RF"
    export function setSleep(mode: number): void { sendAT(`AT+SLEEP=${mode}`) }
    //% block="ตรวจสอบ RF power"
    //% group="⚡ Power & RF"
    export function queryRF(): void { sendAT("AT+RFPOWER?") }
    //% block="ตั้ง RF power: %level"
    //% group="⚡ Power & RF"
    export function setRF(level: number): void { sendAT(`AT+RFPOWER=${level}`) }

    // System
    //% block="รีเซ็ตโมดูล"
    //% group="⚙️ System"
    export function resetModule(): void { sendAT("AT+RST") }
    //% block="คืนค่าโรงงาน"
    //% group="⚙️ System"
    export function restoreFactory(): void { sendAT("AT+RESTORE") }
    //% block="ดูเวอร์ชันเฟิร์มแวร์"
    //% group="⚙️ System"
    export function queryVersion(): void { sendAT("AT+GMR") }
    //% block="ตรวจสอบ RAM"
    //% group="⚙️ System"
    export function queryRAM(): void { sendAT("AT+SYSRAM?") }
    //% block="ตรวจสอบ Flash"
    //% group="⚙️ System"
    export function queryFlash(): void { sendAT("AT+SYSFLASH?") }
    //% block="อัพเดตเฟิร์มแวร์ OTA"
    //% group="⚙️ System"
    export function otaUpdate(): void { sendAT("AT+CIUPDATE") }
    //% block="ตั้งระดับ SysMsg: %level"
    //% group="⚙️ System"
    export function setSysMsg(level: number): void { sendAT(`AT+SYSMSG=${level}`) }

    // SmartConfig
    //% block="เริ่ม SmartConfig"
    //% group="🧠 SmartConfig"
    export function startSmartConfig(): void { sendAT("AT+SMARTSTART") }
    //% block="หยุด SmartConfig"
    //% group="🧠 SmartConfig"
    export function stopSmartConfig(): void { sendAT("AT+SMARTSTOP") }
}