## Issue #1

Next.js dynamic routing destroys session, which prompts user to reauthenticate for every dynamic url click

- Workaround: open dynamic links in new browser tab & pass variable as parameter'

- ToDo: Figure out how to re-authenticate with token generated from client-side via privy-browser. Or generate JWT on server-side via privy-node.

## Issue #2

Draft.js text editor issue
    - many toolbar editor options are disabled

## Issue #3

Metamask x Privy sign in inconsistent
    - doesn't always work on 1st sign-in
    - sometimes Privy user data returns null after sign-in
        - logging out & logging back in resolves this issue
    - same behavior in FF & Chromium browsers

## Issue #4

Router query parameter special chars escape: [ " &nbsp; ]
    - cannot extract full value of json string from url

## Issue #5

Creating two consecutive empty docs deletes/overwrites all docs in storage.
    
## ToDo

- Fix CSS positioning, make responsive
- Add hot keys  >>  CMD + S = Save, etc.
- Show & hide editor (toggle on mouse click / key press)
- Persist session on page reload with localStorage
- Save doc as downloadable html file
- Edit raw content + view with styling applied
    - raw content <-> html string -> html
- Trim doc body, only show content snippets in dashboard
- Sort & filter docs by category / tags / keyword
- Fix draft.js editor options, styling, cursor selection
- Metamask snap: Actions menu + user settings
- Assign read/write access roles with privy-node
    - link user/admin wallet addresses
- Email files to Web2 users
- Version edit history
- Refactor code, DRY
- Prettify app design
- Import & export docs
- Reusable templates

## Routes

   -  [ c ]  /doc/create 
   -  [ r ]   doc/notes
   -  [ u ]  doc/edit/doc_id    
   -  [ d ]  doc/trash