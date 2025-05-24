use crate::{MyError, USER_API_URL};
use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Deserialize, Serialize)]
pub struct SessionUser {
    pub id: usize,
    pub name: String,
    pub email: String,
}

#[derive(Deserialize, Serialize)]
pub struct SessionData {
    pub user: SessionUser,
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
    ) -> Result<(), MyError> {
        let url = USER_API_URL.to_string() + "/auth/login";
        let response = match client
            .post(url)
            .header("Content-Type", "application/json")
            .json(&data)
            .send()
            .await
        {
            Ok(res) => res,
            Err(err) => return Err(MyError::Reqwest(err)),
        };

        match response.status() {
            StatusCode::OK => {
                let body = match response.text().await {
                    Ok(data) => data,
                    Err(err) => return Err(MyError::Reqwest(err)),
                };

                let json: SessionData = match serde_json::from_str(body.as_str()) {
                    Ok(data) => data,
                    Err(err) => return Err(MyError::Serde(err)),
                };

                self.data = Some(json);

                Ok(())
            }
            StatusCode::UNAUTHORIZED | StatusCode::BAD_REQUEST => {
                Err(MyError::Mine("Bad credentials.".to_string()))
            }
            _ => Err(MyError::Mine("Unknown error.".to_string())),
        }
    }

    pub fn clear(&mut self) {
        self.data = None;
    }
}
