import 'package:flutter/material.dart';

import '../models/photo_model.dart';

class PhotoScreen extends StatefulWidget {
  const PhotoScreen({super.key, required this.photo});
  final Photo photo;

  @override
  State<PhotoScreen> createState() => _PhotoScreenState();
}

class _PhotoScreenState extends State<PhotoScreen> {
  int _page = 0;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F0E17),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 2.0),
        child: Column(
          children: [
            const SizedBox(
              height: 220,
            ),
            Container(
              width: double.infinity,
              height: 350,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(widget.photo.imageUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(
              height: 120,
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _page,
        selectedItemColor: const Color(0xffAE2A58),
        unselectedItemColor: const Color(0xffFFFFFE),
        backgroundColor: const Color(0xff0F0E17),
        iconSize: 25,
        onTap: (int page) {
          setState(() {
            _page = page;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.share),
            label: 'Share',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.edit_rounded),
            label: 'Edit photo',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite),
            label: 'Favorite',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.delete),
            label: 'Delete',
          )
        ],
      ),
    );
  }
}
