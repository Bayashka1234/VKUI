<!--- ⚠️ Удалить блок ниже если изменения НЕ по переводу компонента на vkui-tokens ⚠️ --->
<!---После перевода всех компонентов, шаблон следует поправить --->
<!--- [Начало блока] --->
## Чеклист перевода компонента на vkui-tokens
- [ ] Компонент добавлен в `src/tokenized/index.ts` (в `src/index.ts` он так же должен быть)
- [ ] Имя компонента добавлено в массив из `styleguide/tokenized.js`
<!--- По возможности выполняем следующие пункты: --->
<!--- - [ ] Если в стилях встречаются токены из Appearance, то их нужно не удалять, а дополнять фоллбэком на соответствующий токен из vkui-tokens (пример такого PR [#2647](https://togithub.com/VKCOM/VKUI/pull/2647)) --->
<!--- - [ ] Исключаем проверки типа `platform === ANDROID` (пример такого PR [#2653](https://togithub.com/VKCOM/VKUI/pull/2653)) --->
<!--- - [ ] В стилях компонента не осталось платформенных селекторов --->
<!--- - [ ] В tsx компонента не осталось логики, которая зависит от платформы --->
<!--- [Конец блока] --->

---

<!--- Ссылки на задачи --->

- <!--- Например, #228 или fix #404 или resolve #420 --->