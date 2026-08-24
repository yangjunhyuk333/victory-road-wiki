package com.inazumastation.app;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.List;

public class PlayerAdapter extends BaseAdapter {
    private final Context context;
    private final List<PlayerData> players;
    private final LayoutInflater inflater;

    public PlayerAdapter(Context context, List<PlayerData> players) {
        this.context = context;
        this.players = players;
        this.inflater = LayoutInflater.from(context);
    }

    @Override
    public int getCount() {
        return players.size();
    }

    @Override
    public Object getItem(int position) {
        return players.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    private static class ViewHolder {
        ImageView ivThumb;
        TextView tvName;
        TextView tvPos;
        TextView tvElement;
        TextView tvSeries;
        TextView tvDesc;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder holder;
        if (convertView == null) {
            convertView = inflater.inflate(R.layout.item_player, parent, false);
            holder = new ViewHolder();
            holder.ivThumb = (ImageView) convertView.findViewById(R.id.iv_player_thumb);
            holder.tvName = (TextView) convertView.findViewById(R.id.tv_player_name);
            holder.tvPos = (TextView) convertView.findViewById(R.id.tv_player_pos);
            holder.tvElement = (TextView) convertView.findViewById(R.id.tv_player_element);
            holder.tvSeries = (TextView) convertView.findViewById(R.id.tv_player_series);
            holder.tvDesc = (TextView) convertView.findViewById(R.id.tv_player_desc_preview);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        PlayerData p = players.get(position);
        holder.tvName.setText(p.name);
        holder.tvPos.setText(p.position.isEmpty() ? "MF" : p.position);
        holder.tvElement.setText(p.element.isEmpty() ? "풍" : p.element);
        holder.tvSeries.setText(p.series.isEmpty() ? "이나즈마 일레븐" : p.series);

        String desc = p.descriptionKo.isEmpty() ? p.descriptionJa : p.descriptionKo;
        holder.tvDesc.setText(desc.replace("\n", " "));

        // 속성별 컬러링
        if ("풍".equals(p.element) || "風".equals(p.element)) {
            holder.tvElement.setBackgroundColor(Color.parseColor("#0284C7"));
        } else if ("화".equals(p.element) || "火".equals(p.element)) {
            holder.tvElement.setBackgroundColor(Color.parseColor("#E11D48"));
        } else if ("산".equals(p.element) || "山".equals(p.element)) {
            holder.tvElement.setBackgroundColor(Color.parseColor("#D97706"));
        } else if ("림".equals(p.element) || "林".equals(p.element)) {
            holder.tvElement.setBackgroundColor(Color.parseColor("#16A34A"));
        } else {
            holder.tvElement.setBackgroundColor(Color.parseColor("#475569"));
        }

        // 포지션별 컬러링
        if ("GK".equalsIgnoreCase(p.position)) {
            holder.tvPos.setBackgroundColor(Color.parseColor("#EAB308"));
        } else if ("DF".equalsIgnoreCase(p.position)) {
            holder.tvPos.setBackgroundColor(Color.parseColor("#3B82F6"));
        } else if ("MF".equalsIgnoreCase(p.position)) {
            holder.tvPos.setBackgroundColor(Color.parseColor("#10B981"));
        } else if ("FW".equalsIgnoreCase(p.position)) {
            holder.tvPos.setBackgroundColor(Color.parseColor("#EF4444"));
        }

        // 이미지 비동기 로딩
        ImageLoader.getInstance().displayImage(p.image, holder.ivThumb);

        return convertView;
    }
}