// ESP32 + RC522 + SSD1306 -> Memory Mirror backend
// Libraries: MFRC522, Adafruit SSD1306, Adafruit GFX, ArduinoJson (v7)
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

const char* WIFI_SSID  = "YOUR_WIFI";
const char* WIFI_PASS  = "YOUR_PASS";
const char* SCAN_URL   = "https://your-backend.example.com/api/scan";
const char* DEVICE_KEY = "same-value-as-DEVICE_API_KEY";
const char* DEVICE_ID  = "lab-reader-1";

// Adjust pins to your ESP32 Mini board
#define SS_PIN 5     // RC522 SDA
#define RST_PIN 27   // RC522 RST (SCK=18, MOSI=23, MISO=19 are the default VSPI pins)
// OLED on I2C: SDA=21, SCL=22

MFRC522 rfid(SS_PIN, RST_PIN);
Adafruit_SSD1306 oled(128, 64, &Wire, -1);

void show(const char* l1, const char* l2 = "", const char* l3 = "", const char* l4 = "") {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(0, 0);  oled.println(l1);
  oled.setCursor(0, 16); oled.println(l2);
  oled.setCursor(0, 32); oled.println(l3);
  oled.setCursor(0, 48); oled.println(l4);
  oled.display();
}

String uidToHex() {
  String s;
  for (byte i = 0; i < rfid.uid.size; i++) {
    char b[3]; sprintf(b, "%02X", rfid.uid.uidByte[i]); s += b;
  }
  return s;
}

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  SPI.begin();
  rfid.PCD_Init();
  show("Memory Mirror", "Connecting WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) delay(300);
  show("Memory Mirror", "Ready", "Scan a tag");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;
  String uid = uidToHex();
  rfid.PICC_HaltA();
  show("Reading...", uid.c_str());

  WiFiClientSecure client;
  client.setInsecure();  // PRODUCTION: use client.setCACert(rootCA) instead
  HTTPClient http;
  http.begin(client, SCAN_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-device-key", DEVICE_KEY);

  JsonDocument req;
  req["uid"] = uid;
  req["device_id"] = DEVICE_ID;
  String body; serializeJson(req, body);

  int code = http.POST(body);
  if (code == 200 || code == 404) {           // 404 = valid response: tag not registered
    JsonDocument res;
    if (!deserializeJson(res, http.getString())) {
      JsonObject d = res["display"];
      show(d["line1"] | "", d["line2"] | "", d["line3"] | "", d["line4"] | "");
    }
  } else {
    show("Server error", String(code).c_str());
  }
  http.end();
  delay(3000);
  show("Memory Mirror", "Ready", "Scan a tag");
}
