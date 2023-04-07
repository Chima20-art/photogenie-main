import 'dart:convert';

class User {
  final String name;
  final String lastname;
  final String email;
  final String id;
  final String birthday;
  final String username;
  final String country;
  final String phone;
  final String token;
  final String password;

  User({
    required this.token,
    required this.name,
    required this.lastname,
    required this.email,
    required this.id,
    required this.birthday,
    required this.username,
    required this.country,
    required this.phone,
    required this.password,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'lastname': lastname,
      'username': username,
      'birthday': birthday,
      'country': country,
      'email': email,
      'phone': phone,
      'password': password,
      'token': token,
    };
  }

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['_id'] ?? '',
      name: map['name'] ?? '',
      email: map['email'] ?? '',
      password: map['password'] ?? '',
      token: map['token'] ?? '',
      birthday:map['birthday'] ?? '',
      country:map['country'] ?? '',
      lastname:map['lastname'] ?? '',
      phone:map['phone'] ?? '',
      username:map['username'] ?? '',
    );
  }

  String toJson() => json.encode(toMap());

  factory User.fromJson(String source) => User.fromMap(json.decode(source));

  User copyWith({
    String? id,
    String? name,
    String? lastname,
    String? username,
    String? birthday,
    String? country,
    String? email,
    String? phone,
    String? password,
    String? token,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      password: password ?? this.password,
      token: token ?? this.token,
      birthday: birthday ?? this.birthday,
      country: country ?? this.country,
      lastname: lastname ?? this.lastname,
      phone: phone ?? this.phone,
      username: username ?? this.username,
    );
  }
}
