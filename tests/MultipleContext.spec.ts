import { expect, test } from "@playwright/test";

test("opens the login page in separate user contexts", async ({ browser }) => {
    const adminContext = await browser.newContext();
    const viewerContext = await browser.newContext();

    try {
        const adminPage = await adminContext.newPage();
        const viewerPage = await viewerContext.newPage();

        await Promise.all([
            adminPage.goto("https://app.vwo.com/login"),
            viewerPage.goto("https://app.vwo.com/login"),
        ]);

        expect(adminPage.context()).not.toBe(viewerPage.context());
        await expect(adminPage).toHaveURL(/app\.vwo\.com/);
        await expect(viewerPage).toHaveURL(/app\.vwo\.com/);
    } finally {
        await Promise.all([adminContext.close(), viewerContext.close()]);
    }
});