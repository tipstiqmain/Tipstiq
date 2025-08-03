package oa2

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var GoogleOAuthConfig *oauth2.Config

type UserInfo struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

func init() {
	googleClientID := os.Getenv("GOOGLE_CLIENT_ID")
	googleClientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")

	if googleClientID == "" || googleClientSecret == "" {
		fmt.Println("WARNING: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set.")
	}

	GoogleOAuthConfig = &oauth2.Config{
		RedirectURL:  "http://localhost:8080/auth/google/callback",
		ClientID:     googleClientID,
		ClientSecret: googleClientSecret,
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
		Endpoint:     google.Endpoint,
	}
}

func GenerateStateCookie(w http.ResponseWriter) string {
	expiration := time.Now().Add(15 * time.Minute)
	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)
	http.SetCookie(w, &http.Cookie{Name: "oauthstate", Value: state, Expires: expiration, HttpOnly: true})
	return state
}

func GetUserInfo(token *oauth2.Token) (UserInfo, error) {
	var userInfo UserInfo
	client := GoogleOAuthConfig.Client(context.Background(), token)
	response, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return userInfo, fmt.Errorf("failed getting user info: %w", err)
	}
	defer response.Body.Close()
	contents, _ := io.ReadAll(response.Body)
	json.Unmarshal(contents, &userInfo)
	return userInfo, nil
}
