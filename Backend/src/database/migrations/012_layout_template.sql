-- Distinct from theme_id (which only stores the color/font preset).
-- layout_template selects which full set of page/section components a
-- tenant's storefront renders (e.g. "classic" vs "editorial"). Kept as a
-- separate column deliberately, to avoid the naming collision where a color
-- preset and a full layout template could otherwise share the same id.
ALTER TABLE businesses ADD COLUMN layout_template VARCHAR(40) NOT NULL DEFAULT 'classic' AFTER theme_id;

-- NULL until the owner explicitly picks a layout template (via the signup/
-- settings picker or the first-login popup). Used to decide whether to show
-- that popup — it should only appear once, before an explicit choice exists.
ALTER TABLE businesses ADD COLUMN layout_template_selected_at TIMESTAMP NULL DEFAULT NULL AFTER layout_template;
