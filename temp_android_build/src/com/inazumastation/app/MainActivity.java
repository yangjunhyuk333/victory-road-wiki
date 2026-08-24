package com.inazumastation.app;

import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends Activity {
    public static List<PlayerData> allPlayers = new ArrayList<PlayerData>();
    private List<PlayerData> filteredPlayers = new ArrayList<PlayerData>();
    private List<PlayerData> pagedPlayers = new ArrayList<PlayerData>();
    
    private PlayerAdapter playerAdapter;
    private ListView listView;
    private EditText etSearch;
    private TextView tvCount;
    private String currentElementFilter = "";

    // 페이징 상수 (한 번에 50명씩 로드)
    private static final int PAGE_SIZE = 50;
    private int currentPage = 1;
    private boolean isLoadingMore = false;

    // 4개 탭 뷰
    private View tabPlayersView, tabTacticsView, tabMovesView, tabSettingsView;
    private TextView navTvPlayers, navTvTactics, navTvMoves, navTvSettings;

    // 전술판 상태
    private String currentFormation = "4-4-2";
    private FrameLayout pitchSlotsContainer;
    private LinearLayout benchContainer;
    private PlayerData[] startingEleven = new PlayerData[11];
    private PlayerData[] benchSlots = new PlayerData[5];

    // 포메이션별 좌표 정의 (top%, left%)
    private static final Map<String, int[][]> FORMATION_COORDS = new HashMap<String, int[][]>();
    static {
        FORMATION_COORDS.put("4-4-2", new int[][]{
            {86, 50}, {70, 15}, {72, 35}, {72, 65}, {70, 85},
            {46, 15}, {48, 36}, {48, 64}, {46, 85}, {18, 35}, {18, 65}
        });
        FORMATION_COORDS.put("4-3-3", new int[][]{
            {86, 50}, {70, 15}, {72, 35}, {72, 65}, {70, 85},
            {48, 30}, {52, 50}, {48, 70}, {20, 20}, {16, 50}, {20, 80}
        });
        FORMATION_COORDS.put("3-5-2", new int[][]{
            {86, 50}, {72, 25}, {74, 50}, {72, 75}, {50, 15},
            {54, 35}, {54, 65}, {50, 85}, {36, 50}, {18, 35}, {18, 65}
        });
        FORMATION_COORDS.put("4-2-3-1", new int[][]{
            {86, 50}, {70, 15}, {73, 35}, {73, 65}, {70, 85},
            {55, 35}, {55, 65}, {35, 18}, {35, 50}, {35, 82}, {16, 50}
        });
        FORMATION_COORDS.put("3-4-3", new int[][]{
            {86, 50}, {72, 25}, {74, 50}, {72, 75}, {48, 15},
            {48, 38}, {48, 62}, {48, 85}, {20, 25}, {16, 50}, {20, 75}
        });
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initViews();
        loadDatabaseAsync();
        setupBottomNav();
        setupTacticsBoard();
    }

    private void initViews() {
        tabPlayersView = findViewById(R.id.tab_view_players);
        tabTacticsView = findViewById(R.id.tab_view_tactics);
        tabMovesView = findViewById(R.id.tab_view_moves);
        tabSettingsView = findViewById(R.id.tab_view_settings);

        navTvPlayers = (TextView) findViewById(R.id.nav_tv_players);
        navTvTactics = (TextView) findViewById(R.id.nav_tv_tactics);
        navTvMoves = (TextView) findViewById(R.id.nav_tv_moves);
        navTvSettings = (TextView) findViewById(R.id.nav_tv_settings);

        listView = (ListView) findViewById(R.id.list_players);
        etSearch = (EditText) findViewById(R.id.et_search);
        tvCount = (TextView) findViewById(R.id.tv_player_count);

        playerAdapter = new PlayerAdapter(this, pagedPlayers);
        listView.setAdapter(playerAdapter);

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                if (position < pagedPlayers.size()) {
                    PlayerData selected = pagedPlayers.get(position);
                    Intent intent = new Intent(MainActivity.this, PlayerDetailActivity.class);
                    intent.putExtra("player_id", selected.id);
                    startActivity(intent);
                }
            }
        });

        // 50개 단위 무한 스크롤 (Paging)
        listView.setOnScrollListener(new AbsListView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(AbsListView view, int scrollState) {}

            @Override
            public void onScroll(AbsListView view, int firstVisibleItem, int visibleItemCount, int totalItemCount) {
                if (totalItemCount > 0 && (firstVisibleItem + visibleItemCount >= totalItemCount - 5)) {
                    loadNextPage();
                }
            }
        });

        // 실시간 검색창 이벤트
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

        findViewById(R.id.btn_filter_all).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentElementFilter = ""; applyFilter(); }
        });
        findViewById(R.id.btn_filter_wind).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentElementFilter = "풍"; applyFilter(); }
        });
        findViewById(R.id.btn_filter_fire).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentElementFilter = "화"; applyFilter(); }
        });
        findViewById(R.id.btn_filter_earth).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentElementFilter = "산"; applyFilter(); }
        });
        findViewById(R.id.btn_filter_wood).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentElementFilter = "림"; applyFilter(); }
        });
    }

    private void loadDatabaseAsync() {
        if (!allPlayers.isEmpty()) {
            applyFilter();
            return;
        }

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    InputStream is = getAssets().open("characters.json");
                    int size = is.available();
                    byte[] buffer = new byte[size];
                    is.read(buffer);
                    is.close();
                    String json = new String(buffer, StandardCharsets.UTF_8);

                    JSONArray array = new JSONArray(json);
                    final List<PlayerData> list = new ArrayList<PlayerData>();
                    for (int i = 0; i < array.length(); i++) {
                        list.add(PlayerData.fromJson(array.getJSONObject(i)));
                    }

                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            allPlayers.clear();
                            allPlayers.addAll(list);
                            applyFilter();
                            loadSavedTactics();
                            renderPitchSlots();
                        }
                    });
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();
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
        currentPage = 1;
        pagedPlayers.clear();
        loadNextPage();
    }

    private void loadNextPage() {
        if (isLoadingMore) return;
        int start = (currentPage - 1) * PAGE_SIZE;
        if (start >= filteredPlayers.size() && !pagedPlayers.isEmpty()) return;

        isLoadingMore = true;
        int end = Math.min(start + PAGE_SIZE, filteredPlayers.size());
        for (int i = start; i < end; i++) {
            pagedPlayers.add(filteredPlayers.get(i));
        }
        currentPage++;
        playerAdapter.notifyDataSetChanged();
        isLoadingMore = false;
    }

    private void setupBottomNav() {
        findViewById(R.id.nav_btn_players).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { selectTab(0); }
        });
        findViewById(R.id.nav_btn_tactics).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { selectTab(1); }
        });
        findViewById(R.id.nav_btn_moves).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { selectTab(2); }
        });
        findViewById(R.id.nav_btn_settings).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { selectTab(3); }
        });
    }

    private void selectTab(int index) {
        tabPlayersView.setVisibility(index == 0 ? View.VISIBLE : View.GONE);
        tabTacticsView.setVisibility(index == 1 ? View.VISIBLE : View.GONE);
        tabMovesView.setVisibility(index == 2 ? View.VISIBLE : View.GONE);
        tabSettingsView.setVisibility(index == 3 ? View.VISIBLE : View.GONE);

        navTvPlayers.setTextColor(index == 0 ? Color.parseColor("#FBBF24") : Color.parseColor("#94A3B8"));
        navTvTactics.setTextColor(index == 1 ? Color.parseColor("#FBBF24") : Color.parseColor("#94A3B8"));
        navTvMoves.setTextColor(index == 2 ? Color.parseColor("#FBBF24") : Color.parseColor("#94A3B8"));
        navTvSettings.setTextColor(index == 3 ? Color.parseColor("#FBBF24") : Color.parseColor("#94A3B8"));

        if (index == 1) {
            renderPitchSlots();
        }
    }

    private void setupTacticsBoard() {
        pitchSlotsContainer = (FrameLayout) findViewById(R.id.slots_container);
        benchContainer = (LinearLayout) findViewById(R.id.bench_container);

        findViewById(R.id.btn_form_442).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentFormation = "4-4-2"; renderPitchSlots(); }
        });
        findViewById(R.id.btn_form_433).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentFormation = "4-3-3"; renderPitchSlots(); }
        });
        findViewById(R.id.btn_form_352).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentFormation = "3-5-2"; renderPitchSlots(); }
        });
        findViewById(R.id.btn_form_4231).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentFormation = "4-2-3-1"; renderPitchSlots(); }
        });
        findViewById(R.id.btn_form_343).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentFormation = "3-4-3"; renderPitchSlots(); }
        });

        findViewById(R.id.btn_save_tactics).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { saveTactics(); }
        });
        findViewById(R.id.btn_reset_tactics).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { resetTactics(); }
        });
    }

    private void renderPitchSlots() {
        if (pitchSlotsContainer == null) return;
        pitchSlotsContainer.removeAllViews();

        int[][] coords = FORMATION_COORDS.get(currentFormation);
        if (coords == null) coords = FORMATION_COORDS.get("4-4-2");

        for (int i = 0; i < 11; i++) {
            final int slotIndex = i;
            int topPercent = coords[i][0];
            int leftPercent = coords[i][1];

            LinearLayout slotView = createSlotView(startingEleven[i], slotIndex, false);

            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                dpToPx(56), dpToPx(56)
            );
            params.gravity = Gravity.TOP | Gravity.LEFT;
            params.topMargin = (int) (dpToPx(380) * (topPercent / 100.0f) - dpToPx(28));
            params.leftMargin = (int) (getResources().getDisplayMetrics().widthPixels * (leftPercent / 100.0f) - dpToPx(34));

            pitchSlotsContainer.addView(slotView, params);
        }

        if (benchContainer != null) {
            benchContainer.removeAllViews();
            for (int i = 0; i < 5; i++) {
                final int benchIndex = i;
                LinearLayout benchSlotView = createSlotView(benchSlots[i], benchIndex, true);
                LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(dpToPx(56), dpToPx(56));
                lp.setMargins(dpToPx(4), 0, dpToPx(4), 0);
                benchContainer.addView(benchSlotView, lp);
            }
        }
    }

    private LinearLayout createSlotView(final PlayerData player, final int index, final boolean isBench) {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER);
        layout.setBackgroundResource(player != null ? R.drawable.bg_slot_player : R.drawable.bg_slot_empty);
        layout.setClickable(true);

        ImageView iv = new ImageView(this);
        LinearLayout.LayoutParams ivParams = new LinearLayout.LayoutParams(dpToPx(32), dpToPx(32));
        iv.setLayoutParams(ivParams);
        iv.setScaleType(ImageView.ScaleType.FIT_CENTER);

        TextView tv = new TextView(this);
        tv.setTextSize(9);
        tv.setTextColor(Color.WHITE);
        tv.setSingleLine(true);
        tv.setGravity(Gravity.CENTER);

        if (player != null) {
            ImageLoader.getInstance().displayImage(player.image, iv);
            tv.setText(player.name);
        } else {
            tv.setText(isBench ? "후보 " + (index + 1) : (index == 0 ? "GK" : "선수 " + (index + 1)));
            tv.setTextColor(Color.parseColor("#94A3B8"));
        }

        layout.addView(iv);
        layout.addView(tv);

        layout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openPlayerSelectDialog(index, isBench);
            }
        });

        return layout;
    }

    private void openPlayerSelectDialog(final int slotIndex, final boolean isBench) {
        final Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.dialog_select_player);
        dialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(520));

        TextView tvTitle = (TextView) dialog.findViewById(R.id.tv_dialog_title);
        tvTitle.setText((isBench ? "후보 " + (slotIndex + 1) : "선발 슬롯 " + (slotIndex + 1)) + " 선수 선택");

        EditText etDialogSearch = (EditText) dialog.findViewById(R.id.et_dialog_search);
        ListView listDialog = (ListView) dialog.findViewById(R.id.list_dialog_players);

        final List<PlayerData> dialogFiltered = new ArrayList<PlayerData>(allPlayers);
        final PlayerAdapter dialogAdapter = new PlayerAdapter(this, dialogFiltered);
        listDialog.setAdapter(dialogAdapter);

        etDialogSearch.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {
                String q = s.toString().trim().toLowerCase();
                dialogFiltered.clear();
                for (PlayerData p : allPlayers) {
                    if (q.isEmpty() || p.name.toLowerCase().contains(q) || p.position.toLowerCase().contains(q)) {
                        dialogFiltered.add(p);
                    }
                }
                dialogAdapter.notifyDataSetChanged();
            }
            @Override public void afterTextChanged(Editable s) {}
        });

        listDialog.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                PlayerData chosen = dialogFiltered.get(position);
                if (isBench) {
                    benchSlots[slotIndex] = chosen;
                } else {
                    startingEleven[slotIndex] = chosen;
                }
                renderPitchSlots();
                dialog.dismiss();
            }
        });

        dialog.findViewById(R.id.btn_dialog_clear_slot).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isBench) benchSlots[slotIndex] = null;
                else startingEleven[slotIndex] = null;
                renderPitchSlots();
                dialog.dismiss();
            }
        });

        dialog.show();
    }

    private void saveTactics() {
        SharedPreferences sp = getSharedPreferences("inazuma_tactics", MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        editor.putString("formation", currentFormation);
        for (int i = 0; i < 11; i++) {
            editor.putString("start_" + i, startingEleven[i] != null ? startingEleven[i].id : "");
        }
        for (int i = 0; i < 5; i++) {
            editor.putString("bench_" + i, benchSlots[i] != null ? benchSlots[i].id : "");
        }
        editor.apply();
        Toast.makeText(this, "💾 전술 스쿼드가 저장되었습니다!", Toast.LENGTH_SHORT).show();
    }

    private void loadSavedTactics() {
        SharedPreferences sp = getSharedPreferences("inazuma_tactics", MODE_PRIVATE);
        currentFormation = sp.getString("formation", "4-4-2");
        for (int i = 0; i < 11; i++) {
            String id = sp.getString("start_" + i, "");
            startingEleven[i] = findPlayerDataById(id);
        }
        for (int i = 0; i < 5; i++) {
            String id = sp.getString("bench_" + i, "");
            benchSlots[i] = findPlayerDataById(id);
        }
    }

    private void resetTactics() {
        for (int i = 0; i < 11; i++) startingEleven[i] = null;
        for (int i = 0; i < 5; i++) benchSlots[i] = null;
        renderPitchSlots();
        Toast.makeText(this, "🔄 전술판이 초기화되었습니다.", Toast.LENGTH_SHORT).show();
    }

    private PlayerData findPlayerDataById(String id) {
        if (id == null || id.isEmpty()) return null;
        for (PlayerData p : allPlayers) {
            if (p.id.equals(id)) return p;
        }
        return null;
    }

    private int dpToPx(int dp) {
        return (int) (dp * getResources().getDisplayMetrics().density + 0.5f);
    }
}