import assert from "node:assert/strict";
import test from "node:test";
import {
  AVATAR_INVALID_MESSAGE,
  AVATAR_MAX_BYTES,
  AVATAR_REQUIRED_MESSAGE,
  AVATAR_SIZE_MESSAGE,
  AVATAR_TYPE_MESSAGE,
  mergeUserAvatar,
  resolveAvatarUrl,
  userInitials,
  validateAvatarFile,
} from "../src/utils/avatar.ts";

const png = (name = "photo.png", size = 4) => new File([new Uint8Array(size)], name, { type: "image/png" });

test("accepts the image types and extensions the server allows", () => {
  assert.equal(validateAvatarFile(png()), null);
  assert.equal(validateAvatarFile(new File([new Uint8Array(8)], "me.JPEG", { type: "image/jpeg" })), null);
  assert.equal(validateAvatarFile(new File([new Uint8Array(8)], "me.jpg", { type: "image/jpeg; charset=binary" })), null);
  assert.equal(validateAvatarFile(new File([new Uint8Array(8)], "me.gif", { type: "image/gif" })), null);
  assert.equal(validateAvatarFile(new File([new Uint8Array(8)], "me.webp", { type: "image/webp" })), null);
  assert.equal(validateAvatarFile(png("exact.png", AVATAR_MAX_BYTES)), null);
});

test("rejects a missing file, the wrong type, an empty file, and a file over 5MB", () => {
  assert.equal(validateAvatarFile(null), AVATAR_REQUIRED_MESSAGE);
  assert.equal(validateAvatarFile(new File([new Uint8Array(4)], "notes.txt", { type: "text/plain" })), AVATAR_TYPE_MESSAGE);
  assert.equal(validateAvatarFile(new File([new Uint8Array(4)], "photo.png", { type: "image/jpeg" })), AVATAR_TYPE_MESSAGE);
  assert.equal(validateAvatarFile(new File([], "empty.png", { type: "image/png" })), AVATAR_INVALID_MESSAGE);
  assert.equal(validateAvatarFile(png("big.png", AVATAR_MAX_BYTES + 1)), AVATAR_SIZE_MESSAGE);
});

test("builds a public image url from the api base and a root-relative avatar path", () => {
  assert.equal(resolveAvatarUrl(null, "http://localhost:8080"), undefined);
  assert.equal(resolveAvatarUrl("", "http://localhost:8080"), undefined);
  assert.equal(
    resolveAvatarUrl("/uploads/avatars/a.png", "http://localhost:8080"),
    "http://localhost:8080/uploads/avatars/a.png",
  );
  assert.equal(
    resolveAvatarUrl("/uploads/avatars/a.png", "http://localhost:8080/"),
    "http://localhost:8080/uploads/avatars/a.png",
  );
  assert.equal(resolveAvatarUrl("https://cdn.example/a.png", "http://localhost:8080"), "https://cdn.example/a.png");
});

test("uses initials when the user has no picture", () => {
  assert.equal(userInitials("דנה לוי"), "דל");
  assert.equal(userInitials("דנה"), "ד");
  assert.equal(userInitials("  "), "");
});

test("keeps the signed-in user when delete returns only avatarUrl", () => {
  const current = { id: "u1", fullName: "דנה לוי", rank: "סרן", avatarUrl: "/uploads/avatars/old.png" };
  const merged = mergeUserAvatar(current, { avatarUrl: null });
  assert.deepEqual(merged, { ...current, avatarUrl: null });
});

test("stores the full user returned by upload, including the new avatar", () => {
  const current = { id: "u1", fullName: "דנה", rank: "טוראי", unit: "אלון", avatarUrl: null, reportsCount: 2 };
  const merged = mergeUserAvatar(current, {
    id: "u1",
    fullName: "דנה לוי",
    rank: "סרן",
    avatarUrl: "/uploads/avatars/new.png",
  });
  assert.equal(merged.fullName, "דנה לוי");
  assert.equal(merged.rank, "סרן");
  assert.equal(merged.avatarUrl, "/uploads/avatars/new.png");
  assert.equal(merged.unit, "אלון");
  assert.equal(merged.reportsCount, 2);
});
