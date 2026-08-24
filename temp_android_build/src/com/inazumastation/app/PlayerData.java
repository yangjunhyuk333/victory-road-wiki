package com.inazumastation.app;

import org.json.JSONObject;

public class PlayerData {
    public String id = "";
    public String name = "";
    public String kana = "";
    public String element = "";
    public String position = "";
    public String series = "";
    public String gender = "";
    public String image = "";
    public String descriptionKo = "";
    public String descriptionJa = "";
    public String statsText = "";

    public static PlayerData fromJson(JSONObject obj) {
        PlayerData p = new PlayerData();
        p.id = obj.optString("id", "");
        p.name = obj.optString("name", "");
        p.kana = obj.optString("kana", "");
        p.element = obj.optString("element", "");
        p.position = obj.optString("position", "");
        p.series = obj.optString("series", "");
        p.gender = obj.optString("gender", "");
        p.image = obj.optString("image", "");
        p.descriptionKo = obj.optString("description_ko", "");
        p.descriptionJa = obj.optString("description", "");

        JSONObject stats = obj.optJSONObject("stats");
        if (stats != null) {
            p.statsText = "킥: " + stats.optString("kick", "-") + 
                          " | 컨트롤: " + stats.optString("control", "-") + 
                          " | 보디: " + stats.optString("body", "-") + 
                          "\n가드: " + stats.optString("guard", "-") + 
                          " | 스피드: " + stats.optString("speed", "-") + 
                          " | 스태미나: " + stats.optString("stamina", "-") + 
                          " | 거츠: " + stats.optString("guts", "-");
        }
        return p;
    }
}