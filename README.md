# TryOpenIdConnect

This project is a brain dump when I was learning OpenID Connect (OIDC).

The [oidc-client](https://github.com/IdentityModel/oidc-client-js) library is not the best documented library there is :)

I need to implement OpenID Connect on an angular project that uses [UI-Router](https://ui-router.github.io/ng2/) with hash location strategy.

The `src/app/app-routing.module.ts` and `src/app/ve-api/ve-api.service.ts` are the main attractions of this project. They contain multiple comments.

Some issues that I tackled:

* Which oidc-client's commands should I use?
* How to capture the redirect from OIDC provider (OP)?
* What to do when OP mangles the redirect URL that we gave it?
* Which flow to use? Authorization code flow or implicit flow?
* If I want to use implicit flow, what oidc-client settings should I use?
* What is oidc-client doing behind the scene?
* Do users have to login each time they open the app?
* How does oidc-client remember user's login information?
* How to prevent race condition between initializing oidc-client and setting up route authorization guard?
* Which is better, using the same tab or open a pop up?

It took me about two weeks on and off banging my head doing trial and error to finally have a working authentication process.

I can provide a short consultation if you want. Ask me.