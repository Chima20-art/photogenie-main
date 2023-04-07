import 'package:flutter/material.dart';

class TextFieldInput extends StatelessWidget {
  final TextEditingController textEditingController;
  final bool isPass;
  final String hintText;
  final TextInputType textInputType;
  final String icon;

  const TextFieldInput(
      {super.key,
      required this.textEditingController,
      this.isPass = false,
      required this.hintText,
      required this.textInputType,
      required this.icon});

  @override
  Widget build(BuildContext context) {
    final inputBorder = OutlineInputBorder(
      borderSide: Divider.createBorderSide(context),
      borderRadius: BorderRadius.circular(8),
    );
    return TextField(
      style: const TextStyle(color: Color(0xffFFFFFE)),
      controller: textEditingController,
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: const TextStyle(color: Color(0xffa1a1a1), fontSize: 14),
        border: inputBorder,
        focusedBorder: inputBorder,
        filled: true,
        fillColor: const Color(0xff0F0E17),
        contentPadding: const EdgeInsets.symmetric(horizontal: 8),
        prefixIcon: Padding(
          padding: const EdgeInsets.only(right: 8.0),
          child: Image.asset(
            'assets/icons/$icon.png',
          ),
        ),
      ),
      keyboardType: textInputType,
      obscureText: isPass,
    );
  }
}
