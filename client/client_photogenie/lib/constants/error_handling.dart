import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;

void httpErrorHandle({
  required http.Response response,
  required BuildContext context,
  required VoidCallback onSuccess,
}) {
  switch (response.statusCode) {
    case 200:
      onSuccess();
      break;
    case 400:
      Get.snackbar(
        'about signup',
        jsonDecode(response.body)['msg'],
        backgroundColor: const Color(0xff0F0E17),
        snackPosition: SnackPosition.BOTTOM,
        titleText: const Text(
          'SignUp Failed',
          style: TextStyle(
              color: Color.fromARGB(255, 231, 224, 233),
              fontWeight: FontWeight.bold),
        ),
        colorText: const Color(0xffFFFFFE),
      );
      break;
    case 500:
      Get.snackbar(
        'about signup',
        jsonDecode(response.body)['error'],
        backgroundColor: const Color(0xff0F0E17),
        snackPosition: SnackPosition.BOTTOM,
        titleText: const Text(
          'SignUp Failed',
          style: TextStyle(
              color: Color.fromARGB(255, 231, 224, 233),
              fontWeight: FontWeight.bold),
        ),
        colorText: const Color(0xffFFFFFE),
      );
      break;
    default:
      Get.snackbar(
        'about signup',
        response.body,
        backgroundColor: const Color(0xff0F0E17),
        snackPosition: SnackPosition.BOTTOM,
        titleText: const Text(
          'SignUp Failed',
          style: TextStyle(
              color: Color.fromARGB(255, 231, 224, 233),
              fontWeight: FontWeight.bold),
        ),
      );
  }
}
