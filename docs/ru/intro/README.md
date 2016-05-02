## Вводный пример

* [`Предисловие`](#предисловие)
* [`Постановки задачи и простейшая реализация`](#постановки-задачи-и-простейшая-реализация)
* [`Композиция`](#композиция)
* [`Композиция в библиотеке Reelm`](#композиция-в-библиотеке-reelm)
* [`Композиция с сайд эффектами в библиотеке Reelm`](#композиция-с-сайд-эффектами-в-библиотеке-reelm)

#### Предисловие

В этом примере мы рассмотрим какие новшества добавляет библиотека [Reelm](https://github.com/tihonove/reelm) в разработку приложений на стеке react+redux.

Данный пример подразумевает, что вы хорошо знакомы со следующими библиотеками:
1. [React](https://facebook.github.io/react/docs/getting-started.html)
2. [Redux](http://redux.js.org/index.html)

Пример представляет собой эволюцию простого приложения, каждый шаг в данном руководстве соответствует комиту в [репозитории](https://github.com/tihonove/reelm-data-editor-example), который можно склонировать и читать руководство продвигаясь вместе с автором с самого первого комита. 

#### Постановки задачи и простейшая реализация

Поставим задачу: создать форму редактирования Person. Приложение будет представлять собой форму с полями ввода имени и фамилии и кнопкой 'Clear'.

Начнём с написания reducer'а для данных Person.

```javascript
export const Change = 'Change';
export const Clear = 'Clear';

const initialState = {};

export default function personReducer(person = initialState, action) {
    if (!action)
        return person;
    if (action.type === Change) {
        person = { ...person, ...action.data };
    }
    if (action.type === Clear) {
        person = initialState
    }
    return person;
}
```

Теперь создадим представление формы, которое будет работать с этими данными:

```javascript
export default function PersonEditForm({ person, onChange, onClear }) {
    return <div>
            <div>
                First name:
                <input 
                    value={person.fitstName || ''} 
                    onChange={e => onChange({ fitstName: e.target.value })} />
            </div>
            <div>
                Last name:
                <input 
                    value={person.lastName || ''} 
                    onChange={e => onChange({ lastName: e.target.value })} />
            </div>
            <button onClick={onClear}>Clear</button>
        </div>
}
```

Чтобы не размещать эту форму в корне приложения, создадим некое приложение, которое будет вмещать форму и подключим его к store:

```javascript
import PersonEditForm from '../components/PersonEditForm'
import { Change as PersonChange } from '../reducers/personReducer'
import { Clear as PersonClear } from '../reducers/personReducer'

function SinglePersonEditApplication({ person, onPersonChange, onPersonClear }) {
    return <div>
            <PersonEditForm 
                person={person}
                onChange={onPersonChange}
                onClear={onPersonClear}
                 />
        </div>
}

export default connect(
    state => ({ person: state }),
    dispatch => ({
        onPersonChange: data => dispatch({ type: PersonChange, data: data }),
        onPersonClear: () => dispatch({ type: PersonClear })
    }))(SinglePersonEditApplication)
```

и запустим наше приложение:

```javascript
import SinlgePersonEditApplication from './containers/SinlgePersonEditApplication'
import personReducer from './reducers/personReducer'

var store = createStore(personReducer, applyMiddleware(createLogger()));

ReactDom.render(
    <Provider store={store}>
        <SinlgePersonEditApplication />
    </Provider>,
    document.getElementById('content'));
```

Теперь состояние нашего приложения равно состоянию одного экземпляра person, и внутри приложения генерируются и обрабатывают action'ы влияющие на этот экземпляр. Это не совсем удобно, т.к. внутри приложения могут жить другие состояния, генерироваться другие по смыслу action'ы с такими же именами. Есть несколько путей решения такой проблемы. Рассмотрим один из них.

#### Композиция

Кажется, что можно все action'ы из представления PersonEditForm можно направить в personReducer, а состояние над которым работает этот reducer, хранить в каком-то узле состояния всего приложения. Один из способов достигнуть такого поведения таков: всем action'ам генерируемым представлением PersonEditForm добавить некий префикс, а в reducer'е приложения поймать все такие action'ы и, откусив от них префикс, отправить в personReducer. Давайте попробуем это сделать:

```javascript
import personReducer from './personReducer'

// Префикс для action'ов
export const Person = 'Person';

const initialState = {
    person: personReducer()
};

// Регулярно выражение для выделения action'ов
const personPrefixRegex = new RegExp(`^${Person}\.(.*)`);

export default function singlePersonEditReducer(appState = initialState, action) {
    if (!action) 
        return appState;

    // Проверяем на соответствие префиксу
    if (personPrefixRegex.test(action.type)) {
        
        // берём всё, что находится после префикса
        var newType = action.type.match(personPrefixRegex).splice(-1)[0];

        // Строим новые action's с типом бех префикса
        var newAction = { ...action, type: newType };

        appState = { 
            ...appState, 
            person: personReducer(appState.person, newAction) 
        };
    }
    return appState;
}
```

В точке подключения приложения к store добавим к типам action'ов префикс.

```javascript
export default connect(
    state => ({ person: state.person }),
    dispatch => ({
        onPersonChange: (data) => dispatch({ type: `${Person}.${PersonChange}`, data: data }),
        onPersonClear: () => dispatch({ type: `${Person}.${PersonClear}` })
    }))(SinglePersonEditApplication)
```

#### Композиция в библиотеке Reelm

Однако такой способ несколько многословен. Можно попробовать упростить полученную программу.
Подключим библиотеку Reelm:

```
npm install reelm --save 
```

Начнём с personReducer'а и перепишем его при помощи конструкции defineReducer:

```javascript
import { defineReducer } from 'reelm/fluent'

//...

export default defineReducer(initialState)
    .on(Change, (person, { data }) => ({ ...person, ...data }))
    .on(Clear, () => initialState);

```

Композиция reducer'ов в библиотеке Reelm может быть осуществлена при помощи конструкции scopedOver:

```javascript
import { defineReducer } from 'reelm/fluent'

import personReducer from './personReducer'

export const Person = 'Person';

export default defineReducer({})
    .scopedOver(Person, ['person'], personReducer);
```
Первый параметр, принимаемый функцией scopedOver, -- это префикс action'ов, второй -- путь до узла в состоянии на которым будет выполнен reducer, переданный третьим параметром.

Теперь упростим код в точке подключения представления к store. На данный момент он выглядит так:

```javascript
export default connect(
    state => ({ person: state.person }),
    dispatch => ({
        onPersonChange: (data) => dispatch({ type: `${Person}.${PersonChange}`, data: data }),
        onPersonClear: () => dispatch({ type: `${Person}.${PersonClear}` })
    }))(SinglePersonEditApplication)
```

Для этого потребуется перенести функцию dispatch внутрь компонентов:

```javascript
import React from 'react'

import { Change, Clear } from '../reducers/personReducer'

export default function PersonEditForm({ person, dispatch }) {
    var onChange = data => dispatch({ type: Change, data: data })
    var onClear = () => dispatch({ type: Clear })

    return <div> /* ... */ </div>
}
```

Теперь передадим из родительской компоненты в PersonEditForm функцию dispatch, обернув её так, чтобы она добавляла ко всем генерируемым action'ам заданный префикс:

```javascript
function SinglePersonEditApplication({ person, dispatch }) {
    return <div>
            <PersonEditForm 
                person={person}
                dispatch={forwardTo(dispatch, Person)}
                 />
        </div>
}

export default connect(
    state => ({ person: state.person })
    )(SinglePersonEditApplication)
```

Мы получили в точности то же поведение и ту же степень изоляции компонент но с меньшим boilerplate кодом.

#### Композиция с сайд эффектами в библиотеке Reelm

Теперь посмотрим как библиотек Reelm работает с побочными эффектами. Реквестируем такую функциональности: необходимо перед очисткой данных в форме отобразить окно с подтверждением. Но с нескольким условиями: мы не ходим окно держать внутри компоненты формы. Кроме того хочется, чтобы в итоге наш код выглядел как-то так:

```
if ShowConfirmWindow('Clear person data?') then
    ClearData();
```

Для написания такого рода кода существует библиотека [redux-saga](https://github.com/yelouafi/redux-saga). Reelm использует идеи из этой библиотеки, чтобы предоставить возможность писать простой понятный код.

Используя сагу, мы могли бы написать что-то вроде

```javascript
while(true) {
    yield take('Person.ConfirmedClear');
    var result = yield call(ShowConfirmation, 'Clear person data?');
    if (result)
        yield put({ type: 'Person.Clear' })
}
```

Но! На практике композиция такого кода затруднена по нескольким причинам:
1. Такая сага должна быть зарегистрирована в корне приложения.
2. Затруднительно добавлять префиксы к action'ам в саге.
3. ShowConfirmation -- тоже сага, которая управляет запуском модального диалога и привязана к коду статически.

Все эти проблемы можно решить, но код становится многословным, а также к коду композиции (view и редьюсеров) добавляется ещё код композиции саг.

Reelm решает эту проблему, позволяя объединить код композиции саг и reducer'ов. Теперь reducer может возвращать не только состояние, но и эффекты. Мы немного испортили возвращаемое состояние сагой, которую к нему добавили:

```javascript
export default defineReducer(initialState)
    .on(Change, (person, { data }) => ({ ...person, ...data }))
    .on(Clear, () => initialState)
    .on(ConfirmedClear, 
        state => spoiled(state, function* () {
            // yield effects
        }))

```
Код, в котором происходит `yield effects` возвращаются такие же эффекты, которые приняты в библиотек redux-saga, однако есть небольшое отличие. Такая сага возвращает эффекты, которые могут (и должны) быть перехвачены выше по цепочке композиции reducer'ов. Рассмотрим конкретный пример, с окном подтверждения:

```javascript
export default defineReducer(initialState)
    .on(Change, (person, { data }) => ({ ...person, ...data }))
    .on(Clear, () => initialState)
    .on(ConfirmedClear, 
        state => spoiled(state, function* () {
            var confirmed = yield { type: 'RequestConfirmation', text: 'Clean person?' };
            if (confirmed)
                yield put({ type: Clear });
        }))
```
В данном случае мы вернули из саги сайд эффект.

```javascript
{ type: 'RequestConfirmation', text: 'Clean person?' }
```

Это действие которое не может быть обработано в этом reducer'е. Поймаем его в верхней точки композиции reducer'ов: 

```javascript
// application reducer

export default defineReducer({})
    // ...
    .mapEffects(effect => {
        if (effect.type === 'RequestConfirmation') {
            return call(function* (){
                return confirm(effect.text);
            })
        }
        return effect;
    })
```
В данном случае мы просто вызвали синхронную функцию браузера confirm. Однако можно добавить модальное окно подтверждения и поработать с ним:

```javascript
export default defineReducer({})
    .scopedOver(Confirmation, ['confirmation'], confirmationReducer)
    .scopedOver(Person, ['person'], personReducer)
    .mapEffects(effect => {
        if (effect.type === 'RequestConfirmation') {
            return call(function* (){
                yield put({ type: `${Confirmation}.${Show}`, text: effect.text });
                var resultAction = yield take(x => x.type === `${Confirmation}.${Confirm}` || x.type === `${Confirmation}.${Discard}`);
                yield put({ type: `${Confirmation}.${Hide}` });
                return resultAction.type === `${Confirmation}.${Confirm}`;
            })
        }
        return effect;
    })
```

## Тестирование
TODO
