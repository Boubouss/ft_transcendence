use crate::USER_API_URL;
use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Deserialize, Serialize)]
pub struct SessionData {
    pub id: usize,
    pub name: String,
    pub email: String,
    pub token: String,
}

pub struct Session {
    data: Option<SessionData>,
}

impl Session {
    pub fn new() -> Self {
        Self { data: None }
    }

    pub fn get_session(&self) -> &Option<SessionData> {
        &self.data
    }

    pub async fn fetch_login(
        &mut self,
        client: &Client,
        data: HashMap<String, String>,
    ) -> Result<(), String> {
        let url = USER_API_URL.to_string() + "/auth/login";
        let response = match client
            .post(url)
            .header("Content-Type", "application/json")
            .json(&data)
            .send()
            .await
        {
            Ok(res) => res,
            Err(err) => return Err(format!("reqwest: {err}")),
        };

        match response.status() {
            StatusCode::OK => {
                let body = match response.text().await {
                    Ok(data) => data,
                    Err(err) => return Err(format!("reqwest: {err}")),
                };

                let json: SessionData = match serde_json::from_str(body.as_str()) {
                    Ok(data) => data,
                    Err(err) => return Err(format!("serde: {err}")),
                };

                self.data = Some(json);

                Ok(())
            }
            StatusCode::UNAUTHORIZED | StatusCode::BAD_REQUEST | StatusCode::NOT_FOUND => {
                Err("Bad credentials.".to_string())
            }
            _ => Err("Unknown error.".to_string()),
        }
    }

    pub fn clear(&mut self) {
        self.data = None;
    }
}
