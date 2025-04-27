from flask import Flask, request, jsonify
from flask_cors import CORS
import json


app = Flask(__name__)
CORS(app)


# Списки для хранения пользователей и отзывов
users = []
reviews = []


users.extend([
    {'id': 1, 'name': 'Admin', 'email': 'admin@mail.com', 'password': 'admin11', 'role': 'admin', 'blocked': False},
    {'id': 2, 'name': 'User', 'email': 'user@mail.com', 'password': 'user11', 'role': 'user', 'blocked': False}
])

reviews.extend([
    {'id': 1, 'name': 'John', 'email': 'john.doe@mail.com', 'message': 'Отличный сервис!', 'date': '15.04.2025', 'userId': '31', 'block': False},
    {'id': 2, 'name': 'Mike', 'email': 'Mike25@mail.com', 'message': 'Nice', 'date': '20.04.2025', 'userId': '32', 'block': False},
    {'id': 3, 'name': 'Sarah', 'email': 'sarah.connor@mail.com', 'message': 'Быстрая доставка', 'date': '18.04.2025', 'userId': '3', 'block': True},
    {'id': 4, 'name': 'Alex', 'email': 'alex.w@mail.com', 'message': 'Цены могли бы быть ниже', 'date': '12.04.2025', 'userId': '4', 'block': False},
    {'id': 5, 'name': 'Emma', 'email': 'emma.j@mail.com', 'message': 'Отличное качество товаров', 'date': '22.04.2025', 'userId': '5', 'block': False},
    {'id': 6, 'name': 'David', 'email': 'david_k@mail.com', 'message': 'Не понравилось обслуживание', 'date': '10.04.2025', 'userId': '6', 'block': True},
    {'id': 7, 'name': 'Olivia', 'email': 'olivia_p@mail.com', 'message': 'Буду рекомендовать друзьям', 'date': '19.04.2025', 'userId': '7', 'block': False},
    {'id': 8, 'name': 'James', 'email': 'james.b@mail.com', 'message': 'Спасибо за скидку!', 'date': '17.04.2025', 'userId': '8', 'block': False},
    {'id': 9, 'name': 'Sophia', 'email': 'sophia.m@mail.com', 'message': 'Товар не соответствовал описанию', 'date': '14.04.2025', 'userId': '9', 'block': True},
    {'id': 10, 'name': 'Daniel', 'email': 'daniel_t@mail.com', 'message': 'Быстро ответили на вопрос', 'date': '21.04.2025', 'userId': '10', 'block': False},
    {'id': 11, 'name': 'Isabella', 'email': 'izzy.b@mail.com', 'message': 'Пришло не то, что заказывала', 'date': '11.04.2025', 'userId': '11', 'block': True},
    {'id': 12, 'name': 'William', 'email': 'will.g@mail.com', 'message': 'Отличный ассортимент', 'date': '23.04.2025', 'userId': '12', 'block': False},
    {'id': 13, 'name': 'Ava', 'email': 'ava.k@mail.com', 'message': 'Долгая доставка', 'date': '09.04.2025', 'userId': '13', 'block': False},
    {'id': 14, 'name': 'Benjamin', 'email': 'ben.j@mail.com', 'message': 'Все супер!', 'date': '24.04.2025', 'userId': '14', 'block': False},
    {'id': 15, 'name': 'Mia', 'email': 'mia.s@mail.com', 'message': 'Некачественный товар', 'date': '08.04.2025', 'userId': '15', 'block': True},
    {'id': 16, 'name': 'Lucas', 'email': 'lucas.l@mail.com', 'message': 'Вежливый персонал', 'date': '25.04.2025', 'userId': '16', 'block': False},
    {'id': 17, 'name': 'Charlotte', 'email': 'charlotte.r@mail.com', 'message': 'Дорого, но качественно', 'date': '07.04.2025', 'userId': '17', 'block': False},
    {'id': 18, 'name': 'Henry', 'email': 'henry.f@mail.com', 'message': 'Не отвечают на письма', 'date': '26.04.2025', 'userId': '18', 'block': True},
    {'id': 19, 'name': 'Amelia', 'email': 'amelia.b@mail.com', 'message': 'Удобный сайт', 'date': '06.04.2025', 'userId': '19', 'block': False},
    {'id': 20, 'name': 'Jack', 'email': 'jack.h@mail.com', 'message': 'Проблемы с оплатой', 'date': '27.04.2025', 'userId': '20', 'block': True},
    {'id': 21, 'name': 'Harper', 'email': 'harper.w@mail.com', 'message': 'Лучший магазин!', 'date': '05.04.2025', 'userId': '21', 'block': False},
    {'id': 22, 'name': 'Ethan', 'email': 'ethan.m@mail.com', 'message': 'Неприятный запах у товара', 'date': '28.04.2025', 'userId': '22', 'block': True},
    {'id': 23, 'name': 'Evelyn', 'email': 'evelyn.s@mail.com', 'message': 'Быстрый сервис', 'date': '04.04.2025', 'userId': '23', 'block': False},
    {'id': 24, 'name': 'Michael', 'email': 'michael.k@mail.com', 'message': 'Не пришел чек', 'date': '29.04.2025', 'userId': '24', 'block': False},
    {'id': 25, 'name': 'Abigail', 'email': 'abigail.t@mail.com', 'message': 'Все понравилось', 'date': '03.04.2025', 'userId': '25', 'block': False},
    {'id': 26, 'name': 'Alexander', 'email': 'alex.g@mail.com', 'message': 'Ужасное качество', 'date': '30.04.2025', 'userId': '26', 'block': True},
    {'id': 27, 'name': 'Emily', 'email': 'emily.h@mail.com', 'message': 'Приятные цены', 'date': '02.04.2025', 'userId': '27', 'block': False},
    {'id': 28, 'name': 'Matthew', 'email': 'matt.d@mail.com', 'message': 'Не работает сайт', 'date': '01.05.2025', 'userId': '28', 'block': True},
    {'id': 29, 'name': 'Elizabeth', 'email': 'liz.q@mail.com', 'message': 'Отличный выбор', 'date': '01.04.2025', 'userId': '29', 'block': False},
    {'id': 30, 'name': 'Jacob', 'email': 'jacob.r@mail.com', 'message': 'Спасибо за оперативность', 'date': '02.05.2025', 'userId': '30', 'block': False}
])

# Маршруты для пользователей
@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify(users)


@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    for i, user in enumerate(users):
        if user['id'] == user_id:
            del users[i]
            return jsonify({'message': 'Пользователь удален'}), 200
    return jsonify({'error': 'Пользователь не найден'}), 404
        

@app.route('/api/users/<int:user_id>/block', methods=['PUT'])
def block_user(user_id):
    for i, user in enumerate(users):
        if user['id'] == user_id:
            users[i]['blocked'] = not user['blocked']
            return jsonify({'message': 'Статус блокировки изменен', 'user': user}), 200
    return jsonify({'error': 'Пользователь не найден'}), 404
    
@app.route('/api/users/register', methods=['POST'])
def register_user():
    data = request.json
    for user in users:
        if user['email'] == data['email']:
            return jsonify({'error': 'Пользователь с таким email уже существует'}), 400
    
    new_user = {
        'id': max(i["id"] for i in users) + 1,
        'name': data['name'],
        'email': data['email'],
        'password': data['password'],
        'role' : 'user',
        'blocked' : False,
        'reviewBlock': False 
    }
    users.append(new_user)
    return jsonify({'message': 'Пользователь успешно зарегистрирован', 'user': new_user}), 201

@app.route('/api/users/login', methods=['POST'])
def login_user():
    data = request.json
    for user in users:
        if user['email'] == data['email'] and user['password'] == data['password'] and user['blocked'] == False:
            return jsonify({'message': 'Успешный вход', 'user': user}), 200
    return jsonify({'error': 'Неверный email или пароль'}), 401

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    for i, user in enumerate(users):
        if user['id'] == user_id:
            users[i] = {**user, **data}
            return jsonify({'message': 'Пользователь обновлен', 'user': users[i]}), 200
    return jsonify({'error': 'Пользователь не найден'}), 404

# Маршруты для отзывов
@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    return jsonify(reviews)

@app.route('/api/reviews', methods=['POST'])
def add_review():
    data = request.json
    new_review = {
        'id': max(i["id"] for i in reviews) + 1,
        'name': data['name'],
        'email': data['email'],
        'message': data['message'],
        'date': data['date'],
        'userId': data.get('userId'),
        'block': False
    }
    reviews.append(new_review)
    return jsonify({'message': 'Отзыв добавлен', 'review': new_review}), 201

@app.route('/api/reviews/<int:review_id>/block', methods=['PUT'])
def block_review(review_id):
    for i, review in enumerate(reviews):
        if review['id'] == review_id:
            reviews[i]['block'] = not review['block']
            return jsonify({'message': 'Отзыв заблокирован', 'review': review}), 200
    return jsonify({'error': 'Отзыв не найден'}), 404

@app.route('/api/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    for i, review in enumerate(reviews):
        if review['id'] == review_id:
            del reviews[i]
            return jsonify({'message': 'Отзыв удален'}), 200
    

if __name__ == '__main__':
    app.run(debug=True, port=5000) 