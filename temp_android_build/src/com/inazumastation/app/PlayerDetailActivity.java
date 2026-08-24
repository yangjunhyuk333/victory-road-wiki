package com.inazumastation.app;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

public class PlayerDetailActivity extends Activity {
    private PlayerData player;
    private boolean showOriginal = false;
    private TextView tvDesc;
    private Button btnToggleLang;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_player_detail);

        String playerId = getIntent().getStringExtra("player_id");
        for (PlayerData p : MainActivity.allPlayers) {
            if (p.id.equals(playerId)) {
                player = p;
                break;
            }
        }

        if (player == null) {
            finish();
            return;
        }

        findViewById(R.id.btn_back).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { finish(); }
        });

        TextView tvTitle = (TextView) findViewById(R.id.tv_detail_title);
        ImageView ivThumb = (ImageView) findViewById(R.id.iv_detail_thumb);
        TextView tvName = (TextView) findViewById(R.id.tv_detail_name);
        TextView tvKana = (TextView) findViewById(R.id.tv_detail_kana);
        TextView tvPos = (TextView) findViewById(R.id.tv_detail_pos);
        TextView tvElem = (TextView) findViewById(R.id.tv_detail_elem);
        tvDesc = (TextView) findViewById(R.id.tv_detail_desc);
        btnToggleLang = (Button) findViewById(R.id.btn_toggle_lang);
        TextView tvStats = (TextView) findViewById(R.id.tv_detail_stats);
        TextView tvExtra = (TextView) findViewById(R.id.tv_detail_extra);

        tvTitle.setText(player.name + " (" + player.position + ")");
        tvName.setText(player.name);
        tvKana.setText(player.kana);
        tvPos.setText("포지션: " + (player.position.isEmpty() ? "MF" : player.position));
        tvElem.setText("속성: " + (player.element.isEmpty() ? "풍" : player.element));

        updateDescriptionText();

        btnToggleLang.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showOriginal = !showOriginal;
                updateDescriptionText();
            }
        });

        if (!player.statsText.isEmpty()) {
            tvStats.setText(player.statsText);
        }

        tvExtra.setText("시리즈: " + (player.series.isEmpty() ? "이나즈마 일레븐" : player.series) + 
                        "\n성별: " + (player.gender.isEmpty() ? "남성" : player.gender));

        ImageLoader.getInstance().displayImage(player.image, ivThumb);
    }

    private void updateDescriptionText() {
        if (showOriginal) {
            tvDesc.setText(player.descriptionJa.isEmpty() ? "説明がありません。" : player.descriptionJa);
            btnToggleLang.setText("🇰🇷 한국어 번역");
        } else {
            tvDesc.setText(player.descriptionKo.isEmpty() ? player.descriptionJa : player.descriptionKo);
            btnToggleLang.setText("🇯🇵 일어 원문");
        }
    }
}