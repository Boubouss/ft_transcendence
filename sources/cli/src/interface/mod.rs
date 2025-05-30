use crate::{size::Size, BACKGROUND_COLOR};
use elements::{button::Action, Elements};
use reqwest::Client;
use screens::{home::load_home, login::load_login, Screen};
use session::Session;

use std::{
    collections::HashMap,
    io::{stdout, Stdout, Write},
};

use termion::{
    clear,
    color::{self, Bg, Fg},
    cursor,
    event::Key,
    raw::{IntoRawMode, RawTerminal},
    style, terminal_size,
};

mod elements;
mod screens;
mod session;

#[derive(PartialEq, Eq)]
pub enum Status {
    Run,
    Exit,
}

pub struct Interface {
    stdout: RawTerminal<Stdout>,
    client: Client,
    session: Session,
    elements: Vec<Elements>,
    active_index: usize,
    status: Status,
}

impl Interface {
    pub fn new() -> Self {
        let mut interface = Self {
            stdout: stdout().into_raw_mode().unwrap(),
            client: reqwest::Client::builder()
                .danger_accept_invalid_certs(true)
                .build()
                .unwrap(),
            session: Session::new(),
            elements: Vec::new(),
            active_index: 0,
            status: Status::Run,
        };

        interface.render_screen(Screen::Home);

        interface
    }

    pub fn get_status(&self) -> &Status {
        &self.status
    }

    fn get_form_data(&self) -> HashMap<String, String> {
        let mut data: HashMap<String, String> = HashMap::new();

        for element in self.elements.iter() {
            if let Elements::Input(input) = element {
                data.insert(input.get_name().clone(), input.get_value().clone());
            }
        }

        data
    }

    fn auto_active(&mut self) {
        for iterator in self.elements.iter().enumerate() {
            match iterator.1 {
                Elements::Button(_) | Elements::Input(_) => {
                    self.active_index = iterator.0;
                    break;
                }
                _ => {}
            }
        }
    }

    fn render_screen(&mut self, screen: Screen) {
        let terminal_size = match terminal_size() {
            Ok(size) => Size {
                width: size.0,
                height: size.1,
            },
            Err(err) => panic!("Error: {err}"),
        };

        match screen {
            Screen::Home => self.elements = load_home(&terminal_size, self.session.get_session()),
            Screen::Login => self.elements = load_login(&terminal_size),
        };

        self.auto_active();
        self.render_background(&terminal_size);
        self.render_elements();
    }

    fn render_background(&mut self, terminal_size: &Size) {
        let mut i = 0;

        write!(
            self.stdout,
            "{}{}{}",
            clear::All,
            cursor::Goto(1, 1),
            Bg(BACKGROUND_COLOR)
        )
        .unwrap();

        while i < terminal_size.width * terminal_size.height {
            write!(self.stdout, " ").unwrap();
            i += 1;
        }
    }

    fn render_elements(&mut self) {
        for iterator in self.elements.iter().enumerate() {
            let is_active = self.active_index == iterator.0;

            let content = match iterator.1 {
                Elements::Text(text) => text.get_content().clone(),
                Elements::Button(button) => button.get_content(is_active).clone(),
                Elements::Input(input) => input.get_content(is_active).clone(),
                Elements::Error(error) => error.get_content().clone(),
            };

            write!(self.stdout, "{content}").unwrap();
        }

        write!(
            self.stdout,
            "{}{}{}{}",
            style::Reset,
            Fg(color::Reset),
            Bg(color::Reset),
            cursor::Hide
        )
        .unwrap();
        self.stdout.flush().unwrap();
    }

    fn output_error(&mut self, error_msg: &str) {
        for element in &mut self.elements {
            if let Elements::Error(error) = element {
                error.set_content(error_msg.to_string());
            }
        }

        self.render_elements();
    }

    async fn handle_action(&mut self, input: char) -> Result<(), String> {
        if let Elements::Button(button) = &self.elements[self.active_index] {
            match (button.get_action(), input) {
                (Some(Action::Render(screen)), '\n') => self.render_screen(*screen),
                (Some(Action::Login), '\n') => {
                    let data = self.get_form_data();

                    let res = self.session.fetch_login(&self.client, data).await;
                    if let Err(err) = &res {
                        self.output_error(err);

                        return res;
                    }

                    self.render_screen(Screen::Home);
                }
                (Some(Action::Logout), '\n') => {
                    self.session.clear();
                    self.render_screen(Screen::Home);
                }
                (Some(Action::Exit), '\n') => self.status = Status::Exit,
                (_, _) => {}
            };
        } else if let Elements::Input(input_field) = &mut self.elements[self.active_index] {
            input_field.handle_input(input);
        }

        Ok(())
    }

    fn handle_down(&mut self) {
        for iterator in self.elements.iter().enumerate().skip(self.active_index + 1) {
            match iterator.1 {
                Elements::Button(_) | Elements::Input(_) => {
                    self.active_index = iterator.0;
                    break;
                }
                _ => {}
            }
        }
    }

    fn handle_up(&mut self) {
        for iterator in self
            .elements
            .iter()
            .enumerate()
            .rev()
            .skip(self.elements.len() - self.active_index)
        {
            match iterator.1 {
                Elements::Button(_) | Elements::Input(_) => {
                    self.active_index = iterator.0;
                    break;
                }
                _ => {}
            }
        }
    }

    pub async fn handle_input(&mut self, input: Key) -> Result<(), String> {
        match input {
            Key::Up | Key::BackTab => self.handle_up(),
            Key::Down | Key::Char('\t') => self.handle_down(),
            Key::Ctrl('c') | Key::Ctrl('q') => self.status = Status::Exit,
            Key::Char(c) => self.handle_action(c).await?,
            Key::Backspace => self.handle_action(127 as char).await?,
            _ => {}
        };

        self.render_elements();

        Ok(())
    }
}
