import 'package:flutter/material.dart';

class ButtonText extends StatelessWidget {
  final bool isLoading;
  final VoidCallback function;
  final String text;
  final double width;
  const ButtonText({
    super.key,
    required this.function,
    required this.text,
    required this.isLoading,
    required this.width,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: function,
      child: Container(
        width: width,
        alignment: Alignment.center,
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(4),
          color: const Color(0xffAE2A58),
        ),
        child: isLoading
            ? const Center(
                child: SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 3,
                    color: Color(0xffFFFFFE),
                  ),
                ),
              )
            : Text(
                text,
                style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                    color: Color(0xFFFFFFFE)),
              ),
      ),
    );
  }
}
