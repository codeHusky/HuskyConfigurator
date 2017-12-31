package com.codehusky.huskyconfigurator.events;

public class StringEvent {
    private String data;
    public StringEvent(){

    }

    public StringEvent(String data){
        this.data = data;
    }
    public String getData(){
        return data;
    }
    public void setData(String data){
        this.data = data;
    }
}
