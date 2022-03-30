# TvTimeToMyAnimeList
## How to use it ?
I can't host a server so you have to configure the API on your own and include in the api_id.json file the different keys.
```
{"PUBLIC_API_KEY":"[YOUR PUBLIC KEY FROM MY ANIME LIST]",
"PRIVATE_API_KEY":"[YOUR PRIVATE KEY FROM MY ANIME LIST]",
"CODE_CHALLENGE":"[YOUR CODE CHALLENGE THAT YOU NEED TO CREATE]"}
```

First of all you have to create an account on MyAnimeList.
Then you can go in "Edit Profile".
![image](https://user-images.githubusercontent.com/92669641/160826333-192eeda6-e9c7-4fe0-b017-612151e40b78.png)

In "Edit Profile" you have to go in API.
Then click on "Create ID", You will have this form to fill out :
![image](https://user-images.githubusercontent.com/92669641/160826554-a288eed0-05d9-4019-b483-930a72a55f93.png)

You have to choose web in "App Type" and most importantly, in "App Redirect URL" you have to put: 

```http://localhost:[YOUR PORT]/token.html```.

Then you will have the possibility to "Edit" your API and see your Client ID and your Client Secret. Copy them and put them in the json.
```
{"PUBLIC_API_KEY":"Client_ID",
"PRIVATE_API_KEY":"Client_Secret",
"CODE_CHALLENGE":"[YOUR CODE CHALLENGE THAT YOU NEED TO CREATE]"}
```
To finish the setup of the API you have to generate a code challenge, you can do it with this code in python:
```
import secrets

def get_new_code_verifier() -> str:
    token = secrets.token_urlsafe(100)
    return token[:128]

code_verifier = code_challenge = get_new_code_verifier()

print(len(code_verifier))
print(code_verifier)
```
I found this on this blog : https://myanimelist.net/blog.php?eid=835707 it gives you further details on the procedure to have a token with MyAnimeListAPI.

Insert your code challenge in the json.

You have finished the setup of your MyAnimeList API.

Now you have to launch this project on your computer : https://github.com/Rob--W/cors-anywhere/

It gives you the possibility to add automatically CORS header in your request in order to not be blocked by the CORS.

To launch both, use ```node server.js``` in the repository of the proxy and ```npx serve -s -l [YOUR PORT]``` in the repository of this project.

Now go on your TvTime profile and find this div : ```<div id="all-shows">```, right click on it and do "Copy outerHTML" put it in a file on your own to keep it.

You can finally go on the website at this url : ```localhost:[YOUR PORT]``` follow the instructions, you will have your token copy it and fill the next form and put your html in the html section. You can now submit and add your anime !
![image](https://user-images.githubusercontent.com/92669641/160830711-39a2b0ad-b5ef-4d10-8ee5-4b5a3deba33a.png)
