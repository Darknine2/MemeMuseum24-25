import { test, expect, Page } from '@playwright/test';

const getUniqueUser = (workerIndex: number) =>
  `User_${workerIndex}_${Date.now()}`;


async function login(page: Page, username: string, password: string) {
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill(password);
  await page.getByRole('button', { name: 'Accedi' }).click();
}

// --- GRUPPI DI TEST ---

async function signup(page: Page, username: string, password: string, confirmPassword: string) {
  await page.getByRole('link', { name: 'Registrati' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill(password);
  await page.getByRole('textbox', { name: 'Conferma Password' }).fill(confirmPassword);
  await page.getByRole('button', { name: 'Crea account' }).click();
}

test.describe('Requisito 1: Registrazione Utente', () => {

  let uniqueUsername: string;

  test.beforeEach(async ({ page }, testInfo) => {
    await page.goto('http://localhost:4200/home');
    uniqueUsername = getUniqueUser(testInfo.workerIndex);
  });

  test('Test 1 - Registrazione avvenuta con successo', async ({ page }) => {

    await signup(page, uniqueUsername, 'Password2#', 'Password2#');
    await expect(page.getByText('Registrazione completata con successo!')).toBeVisible();
  });

  test('Test 2 - Registrazione fallita per username già esistente', async ({ page }) => {


    await signup(page, uniqueUsername, 'Password2#', 'Password2#');
    await page.getByRole('button', { name: 'Logout' }).click();

    await signup(page, uniqueUsername, 'Password2#', 'Password2#');
    await expect(page.getByText('Username non disponibile.').first()).toBeVisible();
  });

});

test.describe('Requisito 2: Login Utente', () => {

  let uniqueUsername: string;

  test.beforeEach(async ({ page }, testInfo) => {
    await page.goto('http://localhost:4200/home');
    uniqueUsername = getUniqueUser(testInfo.workerIndex);
    await signup(page, uniqueUsername, 'Password2#', 'Password2#');
    await page.getByRole('button', { name: 'Logout' }).click();
  });

  test('Test 3 - Login avvenuto con successo', async ({ page }) => {
    await login(page, uniqueUsername, 'Password2#');
    await expect(page.getByText('Login effettuato con successo!')).toBeVisible();
  });

  test('Test 4 - Login fallito per password errata', async ({ page }) => {
    await login(page, uniqueUsername, 'PasswordErrata');
    await expect(page.getByText('Username o password errati.').first()).toBeVisible();
  });

});

// Requisito 3: Creazione Meme

test.describe('Requisito 3: Creazione Meme', () => {

  let uniqueUsername: string;

  test.beforeEach(async ({ page }, testInfo) => {
    await page.goto('http://localhost:4200/home');
    uniqueUsername = getUniqueUser(testInfo.workerIndex);
    await signup(page, uniqueUsername, 'Password2#', 'Password2#');
  });

  test('Test 5 - Creazione Meme avvenuta con successo', async ({ page }) => {
    await page.getByRole('link', { name: 'Carica il tuo meme' }).click();
    await page.locator('#meme-image-input').setInputFiles('Frontend/MemeMuseum-Frontend/public/logo.png');
    const uniqueTitle = `Titolo_${Date.now()}`;
    await page.getByRole('textbox', { name: 'Titolo *' }).click();
    await page.getByRole('textbox', { name: 'Titolo *' }).fill(uniqueTitle);
    await page.getByRole('textbox', { name: 'Descrizione' }).click();
    await page.getByRole('textbox', { name: 'Descrizione' }).fill('Descrizione');
    await page.getByRole('textbox', { name: 'Tag (max 5 — premi Enter o' }).click();
    await page.getByRole('textbox', { name: 'Tag (max 5 — premi Enter o' }).fill('tag1');
    await page.getByRole('textbox', { name: 'Tag (max 5 — premi Enter o' }).press('Enter');
    await page.getByRole('textbox', { name: 'Tag (max 5 — premi Enter o' }).fill('tag2');
    await page.getByRole('textbox', { name: 'Tag (max 5 — premi Enter o' }).press('Enter');
    await page.getByRole('textbox', { name: 'Tag (max 5 — premi Enter o' }).fill('tag3');
    await page.getByRole('textbox', { name: 'Tag (max 5 — premi Enter o' }).press('Enter');
    await page.getByRole('button', { name: 'Pubblica meme' }).click();
    await expect(page.getByText('Meme caricato con successo!')).toBeVisible();
    await expect(page.getByText(uniqueTitle)).toBeVisible();
    await expect(page.getByText('tag1').first()).toBeVisible();
    await expect(page.getByText('tag2').first()).toBeVisible();
    await expect(page.getByText('tag3').first()).toBeVisible();
    const newMemeCard = page.locator('article').filter({ hasText: uniqueTitle });
    await newMemeCard.getByRole('img', { name: 'Meme Image' }).click();
    await expect(page.getByText('Descrizione').first()).toBeVisible();
    await expect(page.getByText(uniqueTitle).first()).toBeVisible();
    await expect(page.getByText('tag1').first()).toBeVisible();
    await expect(page.getByText('tag2').first()).toBeVisible();
    await expect(page.getByText('tag3').first()).toBeVisible();

  });

  test('Test 6 - Caricamento bloccato se il file non è un\'immagine', async ({ page }) => {
    await page.getByRole('link', { name: 'Carica il tuo meme' }).click();
    await page.locator('#meme-image-input').setInputFiles('Frontend/MemeMuseum-Frontend/playwright.config.ts');
    await expect(page.getByText('Formato file non supportato. Inserisci un\'immagine.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pubblica meme' })).toBeDisabled();
  });

});


test.describe('Requisito 4: Funzionamento Commenti', () => {

  test.beforeEach(async ({ page }, testInfo) => {
    await page.goto('http://localhost:4200/home');
  });


  test('Test 7 - Commentare da utente loggato', async ({ page }, testInfo) => {

    const uniqueUsername = getUniqueUser(testInfo.workerIndex);
    await signup(page, uniqueUsername, 'Password2#', 'Password2#');
    await page.getByRole('img', { name: 'Meme Image' }).first().click();
    await page.getByRole('textbox', { name: 'Aggiungi un commento...' }).click();
    await page.getByRole('textbox', { name: 'Aggiungi un commento...' }).fill('Commento55');
    await page.getByRole('button', { name: 'Pubblica' }).click();
    await expect(page.getByText(uniqueUsername, { exact: true })).toBeVisible();
    await expect(page.getByText('Commento55', { exact: true })).toBeVisible();

  });

  test('Test 8 - Commentare da utente non loggato', async ({ page }) => {
    await page.getByRole('img', { name: 'Meme Image' }).first().click();
    await expect(page.getByText('Fai Login o Registrati per')).toBeVisible();

  });

});


test.describe('Requisito 5: Funzionamento Upvote/Downvote', () => {

  test.beforeEach(async ({ page }, testInfo) => {
    await page.goto('http://localhost:4200/home');
  });


  test('Test 9 - Upvote/Downvote da utente loggato', async ({ page }, testInfo) => {
    const uniqueUsername = getUniqueUser(testInfo.workerIndex);
    await signup(page, uniqueUsername, 'Password2#', 'Password2#');

    // primo mem del feed
    await page.getByRole('img', { name: 'Meme Image' }).first().click();

    // Individuiamo contenitore bottoni di voto e conteggio 
    const voteGroup = page.locator('.vote-group').first();
    const voteCountLocator = voteGroup.locator('.vote-count');

    // Estraiamo il numero dal testo
    const initialVoteText = await voteCountLocator.textContent() || '0';
    const initialVote = parseInt(initialVoteText.trim(), 10);

    // click upvote e verifichiamo che si alzi di 1
    await voteGroup.locator('.upvote-btn').click();
    await expect(voteCountLocator).toHaveText((initialVote + 1).toString());

    // click downvote. Passando da un +1 a un downvote (-1 di base), 
    await voteGroup.locator('.downvote-btn').click();
    await expect(voteCountLocator).toHaveText((initialVote - 1).toString());

    // rimuoviamo il voto ricliccando Downvote
    await voteGroup.locator('.downvote-btn').click();
    await expect(voteCountLocator).toHaveText(initialVote.toString());
  });

  test('Test 10 - Upvote/Downvote da utente non loggato', async ({ page }) => {
    await page.getByRole('img', { name: 'Meme Image' }).first().click();

    const voteGroup = page.locator('.vote-group').first();

    await voteGroup.locator('.upvote-btn').click();
    await expect(page.getByText('Effettua l\'accesso')).toBeVisible();

    await page.getByRole('button', { name: 'Annulla' }).click();

    await voteGroup.locator('.downvote-btn').click();
    await expect(page.getByText('Effettua l\'accesso')).toBeVisible();
  });

});
