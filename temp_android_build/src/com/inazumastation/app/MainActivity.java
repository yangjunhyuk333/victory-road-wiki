package com.inazumastation.app;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

import org.json.JSONArray;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {
    public static List<PlayerData> allPlayers = new ArrayList<PlayerData>();
    private List<PlayerData> filteredPlayers = new ArrayList<PlayerData>();
    private PlayerAdapter adapter;
    private ListView listView;
    private EditText etSearch;
    private TextView tvCount;
    private String currentElementFilter = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        listView = (ListView) findViewById(R.id.list_players);
        etSearch = (EditText) findViewById(R.id.et_search);
        tvCount = (TextView) findViewById(R.id.tv_player_count);

        loadPlayersData();

        adapter = new PlayerAdapter(this, filteredPlayers);
        listView.setAdapter(adapter);

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                PlayerData selected = filteredPlayers.get(position);
                Intent intent = new Intent(MainActivity.this, PlayerDetailActivity.class);
                intent.putExtra("player_id", selected.id);
                startActivity(intent);
            }
        });

        // 실시간 검색
        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                applyFilter();
            }
            @Override
            public void afterTextChanged(Editable s) {}
        });

        // 속성 필터 버튼 리스너
        findViewById(R.id.btn_filter_all).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { currentElementFilter = ""; applyFilter(); }
        });
        findViewById(R.id.btn_filter_wind).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { currentElementFilter = "풍"; applyFilter(); }
        });
        findViewById(R.id.btn_filter_fire).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { currentElementFilter = "화"; applyFilter(); }
        });
        findViewById(R.id.btn_filter_earth).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { currentElementFilter = "산"; applyFilter(); }
        });
        findViewById(R.id.btn_filter_wood).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { currentElementFilter = "림"; applyFilter(); }
        });
    }

    private void loadPlayersData() {
        if (!allPlayers.isEmpty()) {
            filteredPlayers.addAll(allPlayers);
            return;
        }

        try {
            InputStream is = getAssets().open("characters.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            String json = new String(buffer, StandardCharsets.UTF_8);

            JSONArray array = new JSONArray(json);
            for (int i = 0; i < array.length(); i++) {
                allPlayers.add(PlayerData.fromJson(array.getJSONObject(i)));
            }
            filteredPlayers.addAll(allPlayers);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void applyFilter() {
        String query = etSearch.getText().toString().trim().toLowerCase();
        filteredPlayers.clear();

        for (PlayerData p : allPlayers) {
            boolean matchElem = currentElementFilter.isEmpty() || p.element.contains(currentElementFilter);
            boolean matchQuery = query.isEmpty() || 
                                 p.name.toLowerCase().contains(query) || 
                                 p.kana.toLowerCase().contains(query) || 
                                 p.position.toLowerCase().contains(query) ||
                                 p.series.toLowerCase().contains(query);

            if (matchElem && matchQuery) {
                filteredPlayers.add(p);
            }
        }
        tvCount.setText(filteredPlayers.size() + "명");
        adapter.notifyDataSetChanged();
    }
}